import { useState, useEffect, Suspense } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getLectureMeta, getPrevLectureId, getNextLectureId } from '@/data/lectures'
import { getModuleForLecture } from '@/data/modules'
import { getNodeById } from '@/data/knowledge-nodes'
import { getAnimationById, getAnimationsForLecture } from '@/data/animation-registry'
import { getLessonSupport } from '@/data/adhd-support'
import { getKnowledgeThreadsForLecture } from '@/data/knowledge-threads'
import { hasAnimationComponent } from '@/components/animation/animation-components'
import { useStore } from '@/store'
import AnimationPlayer from '@/components/animation/AnimationPlayer'
import StatusBadge from '@/components/shared/StatusBadge'
import ConceptTag from '@/components/shared/ConceptTag'
import MathText from '@/components/shared/MathText'
import ConnectionSection from '@/components/lecture/ConnectionSection'
import ConceptSection from '@/components/lecture/ConceptSection'
import MethodSection from '@/components/lecture/MethodSection'
import ExampleSection from '@/components/lecture/ExampleSection'
import ExerciseSection from '@/components/lecture/ExerciseSection'
import ErrorAnalysisSection from '@/components/lecture/ErrorAnalysisSection'
import OralTaskSection from '@/components/lecture/OralTaskSection'
import AdhdLessonStart from '@/components/lecture/AdhdLessonStart'
import AdhdLessonClosure from '@/components/lecture/AdhdLessonClosure'
import LearningPause from '@/components/lecture/LearningPause'
import type { LectureStatus, Lecture } from '@/types'

function useLectureContent(lectureId: number): Lecture | null {
  const [data, setData] = useState<Lecture | null>(null)

  useEffect(() => {
    let cancelled = false
    const id = String(lectureId).padStart(2, '0')
    import(`@/data/lectures/lecture-${id}.ts`)
      .then((m) => { if (!cancelled) setData(m.default as Lecture) })
      .catch(() => { if (!cancelled) setData(null) })
    return () => { cancelled = true }
  }, [lectureId])

  return data
}

export default function LecturePage() {
  const { lectureId } = useParams<{ lectureId: string }>()
  const id = parseInt(lectureId || '1')
  const meta = getLectureMeta(id)
  const content = useLectureContent(id)
  const module = meta ? getModuleForLecture(id) : null
  const lessonSupport = getLessonSupport(id)
  const knowledgeThreads = getKnowledgeThreadsForLecture(id)
  const status = useStore((s) => s.progress.lectureStatuses[id] || 'not-started')
  const markLectureStatus = useStore((s) => s.markLectureStatus)
  const setLastStudied = useStore((s) => s.setLastStudied)
  const addStudyTime = useStore((s) => s.addStudyTime)

  useEffect(() => {
    setLastStudied(id)
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') addStudyTime(1)
    }, 60_000)
    return () => window.clearInterval(timer)
  }, [id, setLastStudied, addStudyTime])

  if (!meta) {
    return <div className="text-center py-12 text-gray-500">课程未找到</div>
  }
  const displayMeta = content?.meta ?? meta

  const prevId = getPrevLectureId(id)
  const nextId = getNextLectureId(id)
  const prevLecture = prevId ? getLectureMeta(prevId) : null
  const nextLecture = nextId ? getLectureMeta(nextId) : null
  const contentAnimations = (content?.animationIds ?? [])
    .map((animationId) => getAnimationById(animationId))
    .filter((animation): animation is NonNullable<typeof animation> => Boolean(animation))
  const animations = [...getAnimationsForLecture(id), ...contentAnimations]
    .filter((animation, index, all) => all.findIndex((item) => item.id === animation.id) === index)
  const displayAnimations = animations.filter((anim) => hasAnimationComponent(anim.id))

  const handleStatusChange = (newStatus: LectureStatus) => {
    markLectureStatus(id, newStatus)
    setLastStudied(id)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          {module && (
            <Link to={`/modules/${module.id}`} className="text-xs px-2 py-0.5 rounded-full bg-primary-50 text-primary-700 font-medium">
              {module.subtitle}：{module.title}
            </Link>
          )}
          <StatusBadge status={status} size="md" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">
          第{id}讲：{displayMeta.title}
        </h1>
        <p className="text-gray-500 mt-1 text-lg leading-relaxed"><MathText>{displayMeta.oneLineMainIdea}</MathText></p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(['not-started', 'in-progress', 'needs-review', 'error-prone', 'mastered'] as LectureStatus[]).map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`text-sm px-3 py-1 rounded-full border transition-colors ${
              status === s
                ? 'border-primary-400 bg-primary-50 text-primary-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <StatusBadge status={s} size="sm" />
          </button>
        ))}
      </div>

      {lessonSupport && <AdhdLessonStart support={lessonSupport} threads={knowledgeThreads} network={content?.knowledgeNetwork} />}

      <section className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
        <h2 className="font-semibold text-gray-800 mb-3">讲次链路</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-amber-600 mb-1">前置讲次</h3>
            <ul className="space-y-1">
              {displayMeta.prerequisiteLectureIds.map((pid) => {
                const pl = getLectureMeta(pid)
                return pl ? (
                  <li key={pid}>
                    <Link to={`/lectures/${pid}`} className="text-gray-600 hover:text-primary-600">
                      第{pid}讲：{pl.title}
                    </Link>
                  </li>
                ) : null
              })}
              {displayMeta.prerequisiteLectureIds.length === 0 && (
                <li className="text-gray-400">本讲是这条知识链的起点</li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-blue-600 mb-1">本讲概念</h3>
            <ul className="space-y-1">
              {displayMeta.conceptIds.map((cid) => {
                const node = getNodeById(cid)
                return node ? (
                  <li key={cid} className="flex items-center gap-1">
                    <ConceptTag conceptId={cid} />
                  </li>
                ) : null
              })}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-600 mb-1">后续讲次</h3>
            <ul className="space-y-1">
              {displayMeta.followupLectureIds.map((fid) => {
                const fl = getLectureMeta(fid)
                return fl ? (
                  <li key={fid}>
                    <Link to={`/lectures/${fid}`} className="text-gray-600 hover:text-primary-600">
                      第{fid}讲：{fl.title}
                    </Link>
                  </li>
                ) : null
              })}
              {displayMeta.followupLectureIds.length === 0 && (
                <li className="text-gray-400">本讲当前是这条知识链的终点</li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {displayMeta.objectives.length > 0 && (
        <section className="mb-8">
          <h2 className="font-semibold text-gray-800 mb-2">学习目标</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {displayMeta.objectives.map((obj, i) => <li key={i}><MathText>{obj}</MathText></li>)}
          </ul>
        </section>
      )}

      {displayMeta.overview && (
        <section className="mb-8 lecture-content">
          <h2 className="font-semibold text-gray-800 mb-2">本讲概述</h2>
          <p className="text-gray-600 leading-relaxed"><MathText>{displayMeta.overview}</MathText></p>
        </section>
      )}

      <Suspense fallback={<div className="text-center py-8 text-gray-400">加载课程内容中...</div>}>
        {content ? (
          <>
            <ConnectionSection network={content.knowledgeNetwork} />
            <ConceptSection concepts={content.concepts} />
            <LearningPause title="暂停一下" prompt="先用一句话说出本讲最重要的概念，再继续学习解题方法。" />
            <MethodSection methods={content.coreMethods} />
            <LearningPause title="想一想" prompt="接下来每道题先说出所属知识主线、题型和第一步，再展开计算或证明。" />
            <ExampleSection questions={content.typicalQuestions} threads={knowledgeThreads} />
            <ErrorAnalysisSection mistakes={content.commonMistakes} />
            <LearningPause title="检查一下" prompt="回看刚才的例题：关键词圈了吗？题型和第一步说清楚了吗？休息3分钟后再做变式训练。" />
            <ExerciseSection
              basic={content.exercises.basic}
              intermediate={content.exercises.intermediate}
              challenge={content.exercises.challenge}
              knowledgeTransfer={content.exercises.knowledgeTransfer}
              lectureId={id}
              lectureTitle={displayMeta.title}
            />
            <LearningPause title="说一说" prompt="请用一句话说出本节核心知识，再说出它从哪里来、下一步会用到哪里。" />
            <OralTaskSection task={content.oralTask} />

            {content.errorCard.fields.errorNumber && (
              <section className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
                <h2 className="font-semibold text-gray-800 mb-3">错题复盘卡</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {[
                    ['编号', content.errorCard.fields.errorNumber],
                    ['类型', content.errorCard.fields.errorType],
                    ['错因', content.errorCard.fields.errorReason],
                    ['正确方法', content.errorCard.fields.correctMethod],
                    ['同类再练', content.errorCard.fields.similarPractice],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-2">
                      <span className="font-medium text-gray-700 flex-shrink-0">{label}：</span>
                      <span className="text-gray-600"><MathText>{value}</MathText></span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : <div className="text-center py-4 text-gray-400">课程内容加载失败</div>}
      </Suspense>

      {displayAnimations.length > 0 && (
        <section className="mb-8 p-4 bg-white rounded-lg border border-gray-200">
          <h2 className="font-semibold text-gray-800 mb-3">动图演示</h2>
          <div className="grid grid-cols-1 gap-4">
            {displayAnimations.map((anim) => (
              <AnimationPlayer key={anim.id} animationId={anim.id} />
            ))}
          </div>
        </section>
      )}

      {lessonSupport && <AdhdLessonClosure support={lessonSupport} lectureId={id} />}

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        {prevLecture ? (
          <Link to={`/lectures/${prevId}`} className="text-primary-600 hover:text-primary-700 font-medium">
            ← 第{prevId}讲：{prevLecture.title}
          </Link>
        ) : <div />}
        {nextLecture ? (
          <Link to={`/lectures/${nextId}`} className="text-primary-600 hover:text-primary-700 font-medium">
            第{nextId}讲：{nextLecture.title} →
          </Link>
        ) : <div />}
      </div>
    </div>
  )
}

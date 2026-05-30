import { lazy } from 'react'
import type { FC, LazyExoticComponent } from 'react'

type AnimationComponent = LazyExoticComponent<FC<{ phase: number; playing: boolean }>>

export const ANIMATION_COMPONENTS: Record<string, AnimationComponent> = {
  'number-line-ops': lazy(() => import('./svg/NumberLineOps')),
  'bracket-removal': lazy(() => import('./svg/BracketRemoval')),
  'elimination-method': lazy(() => import('./svg/EliminationMethod')),
  'parallel-angles': lazy(() => import('./svg/ParallelAngles')),
  'linear-function-kb': lazy(() => import('./svg/LinearFunction')),
  'reflection-shortest-path': lazy(() => import('./svg/ReflectionShortestPath')),
  'absolute-value-distance': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.AbsoluteValueDistance }))),
  'exponentiation-brackets': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.ExponentiationBrackets }))),
  'balance-scale': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.BalanceScale }))),
  'inequality-flip': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.InequalityFlip }))),
  'triangle-angle-sum': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.TriangleAngleSum }))),
  'congruent-overlay': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.CongruentOverlay }))),
  'axis-symmetry-fold': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.AxisSymmetryFold }))),
  'pythagorean-tiles': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.PythagoreanTiles }))),
  'parallelogram-drag': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.ParallelogramDrag }))),
  'coordinate-point-move': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.CoordinatePointMove }))),
  'coordinate-translation': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.CoordinateTranslation }))),
  'two-lines-intersection': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.TwoLinesIntersection }))),
  'variance-scatter': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.VarianceScatter }))),
  'mean-dynamic': lazy(() => import('./svg/MoreMathAnimations').then((m) => ({ default: m.MeanDynamic }))),
}

export function hasAnimationComponent(animationId: string): boolean {
  return animationId in ANIMATION_COMPONENTS
}

package app.signalnoise.twa.widget;

import android.animation.ValueAnimator;
import android.animation.TimeInterpolator;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.BounceInterpolator;
import android.view.animation.OvershootInterpolator;
import android.graphics.Path;
import android.graphics.PathMeasure;
import android.graphics.PointF;
import java.util.ArrayList;
import java.util.List;

/**
 * Signal Wave Animation Engine
 *
 * Provides smooth, natural animations following Jony Ive's principles
 * of honest, fluid motion without excessive decoration
 *
 * Performance: Frame-perfect 60fps animations
 */
public class SignalWaveAnimator {

    // Animation constants
    private static final long WAVE_CYCLE_DURATION = 4000; // 4 seconds per wave cycle
    private static final long PARTICLE_LIFETIME = 3000; // 3 seconds
    private static final long TRANSITION_DURATION = 500; // 500ms for ratio changes

    // Interpolators for different animation types
    private final TimeInterpolator waveInterpolator = new SineWaveInterpolator();
    private final TimeInterpolator transitionInterpolator = new AccelerateDecelerateInterpolator();
    private final TimeInterpolator bounceInterpolator = new BounceInterpolator();
    private final TimeInterpolator overshootInterpolator = new OvershootInterpolator(1.2f);

    // Current animation state
    private float currentWavePhase = 0f;
    private float targetRatio = 80f;
    private float currentRatio = 80f;
    private long lastUpdateTime = 0;

    // Value animators
    private ValueAnimator ratioAnimator;
    private ValueAnimator waveAnimator;
    private List<ParticleAnimation> particleAnimations = new ArrayList<>();

    public SignalWaveAnimator() {
        initializeWaveAnimation();
    }

    /**
     * Initialize continuous wave animation
     */
    private void initializeWaveAnimation() {
        waveAnimator = ValueAnimator.ofFloat(0f, (float)(2 * Math.PI));
        waveAnimator.setDuration(WAVE_CYCLE_DURATION);
        waveAnimator.setRepeatCount(ValueAnimator.INFINITE);
        waveAnimator.setInterpolator(waveInterpolator);

        waveAnimator.addUpdateListener(animation -> {
            currentWavePhase = (float) animation.getAnimatedValue();
        });

        waveAnimator.start();
    }

    /**
     * Animate ratio change with smooth transition
     */
    public void animateRatioChange(float newRatio) {
        if (ratioAnimator != null && ratioAnimator.isRunning()) {
            ratioAnimator.cancel();
        }

        targetRatio = newRatio;

        ratioAnimator = ValueAnimator.ofFloat(currentRatio, targetRatio);
        ratioAnimator.setDuration(TRANSITION_DURATION);

        // Choose interpolator based on change direction
        if (newRatio > currentRatio) {
            // Increasing - use overshoot for celebration
            ratioAnimator.setInterpolator(overshootInterpolator);
        } else {
            // Decreasing - use smooth deceleration
            ratioAnimator.setInterpolator(transitionInterpolator);
        }

        ratioAnimator.addUpdateListener(animation -> {
            currentRatio = (float) animation.getAnimatedValue();
        });

        ratioAnimator.start();
    }

    /**
     * Get current wave phase for rendering
     */
    public float getWavePhase() {
        return currentWavePhase;
    }

    /**
     * Get interpolated ratio for smooth transitions
     */
    public float getCurrentRatio() {
        return currentRatio;
    }

    /**
     * Create particle burst animation for achievements
     */
    public void createParticleBurst(float x, float y, int particleCount) {
        for (int i = 0; i < particleCount; i++) {
            ParticleAnimation particle = new ParticleAnimation(x, y, i * (360f / particleCount));
            particle.start();
            particleAnimations.add(particle);
        }

        // Clean up finished animations
        particleAnimations.removeIf(ParticleAnimation::isFinished);
    }

    /**
     * Update all animations
     */
    public void update() {
        long currentTime = System.currentTimeMillis();
        float deltaTime = (currentTime - lastUpdateTime) / 1000f;
        lastUpdateTime = currentTime;

        // Update particle animations
        for (ParticleAnimation particle : particleAnimations) {
            particle.update(deltaTime);
        }
    }

    /**
     * Get active particle positions for rendering
     */
    public List<PointF> getParticlePositions() {
        List<PointF> positions = new ArrayList<>();
        for (ParticleAnimation particle : particleAnimations) {
            if (!particle.isFinished()) {
                positions.add(particle.getPosition());
            }
        }
        return positions;
    }

    /**
     * Create smooth wave path with Bezier curves
     */
    public Path createSmoothWavePath(float width, float height, float amplitude, float frequency) {
        Path path = new Path();
        float centerY = height / 2f;

        // Calculate control points for smooth Bezier curves
        List<PointF> points = new ArrayList<>();
        List<PointF> controlPoints = new ArrayList<>();

        // Generate wave points
        for (int x = 0; x <= width; x += 10) {
            float phase = currentWavePhase + x * frequency;
            float y = centerY + amplitude * (float)Math.sin(phase);
            points.add(new PointF(x, y));
        }

        // Calculate control points using Catmull-Rom splines
        for (int i = 1; i < points.size() - 1; i++) {
            PointF prev = points.get(i - 1);
            PointF curr = points.get(i);
            PointF next = points.get(i + 1);

            float tension = 0.5f;
            float tx = tension * (next.x - prev.x);
            float ty = tension * (next.y - prev.y);

            controlPoints.add(new PointF(curr.x - tx, curr.y - ty));
            controlPoints.add(new PointF(curr.x + tx, curr.y + ty));
        }

        // Build smooth path
        if (points.size() > 0) {
            path.moveTo(points.get(0).x, points.get(0).y);

            for (int i = 1; i < points.size(); i++) {
                if (i < controlPoints.size() / 2) {
                    PointF cp1 = controlPoints.get((i - 1) * 2 + 1);
                    PointF cp2 = controlPoints.get(i * 2);
                    PointF end = points.get(i);

                    path.cubicTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
                } else {
                    path.lineTo(points.get(i).x, points.get(i).y);
                }
            }
        }

        return path;
    }

    /**
     * Calculate easing value for transitions
     */
    public float getEasedValue(float progress, EasingType type) {
        switch (type) {
            case EASE_IN_OUT:
                return easeInOutCubic(progress);
            case EASE_OUT_BOUNCE:
                return easeOutBounce(progress);
            case EASE_OUT_ELASTIC:
                return easeOutElastic(progress);
            case LINEAR:
            default:
                return progress;
        }
    }

    /**
     * Cubic ease in/out
     */
    private float easeInOutCubic(float t) {
        if (t < 0.5f) {
            return 4f * t * t * t;
        } else {
            float p = 2f * t - 2f;
            return 1f + p * p * p / 2f;
        }
    }

    /**
     * Bounce ease out
     */
    private float easeOutBounce(float t) {
        if (t < 1f / 2.75f) {
            return 7.5625f * t * t;
        } else if (t < 2f / 2.75f) {
            t -= 1.5f / 2.75f;
            return 7.5625f * t * t + 0.75f;
        } else if (t < 2.5f / 2.75f) {
            t -= 2.25f / 2.75f;
            return 7.5625f * t * t + 0.9375f;
        } else {
            t -= 2.625f / 2.75f;
            return 7.5625f * t * t + 0.984375f;
        }
    }

    /**
     * Elastic ease out
     */
    private float easeOutElastic(float t) {
        if (t == 0 || t == 1) return t;

        float p = 0.3f;
        float s = p / 4f;

        return (float)(Math.pow(2, -10 * t) * Math.sin((t - s) * (2 * Math.PI) / p) + 1);
    }

    /**
     * Clean up animators
     */
    public void cleanup() {
        if (waveAnimator != null) {
            waveAnimator.cancel();
        }
        if (ratioAnimator != null) {
            ratioAnimator.cancel();
        }
        particleAnimations.clear();
    }

    /**
     * Custom sine wave interpolator for natural wave motion
     */
    private static class SineWaveInterpolator implements TimeInterpolator {
        @Override
        public float getInterpolation(float input) {
            return (float)Math.sin(input * Math.PI * 2);
        }
    }

    /**
     * Individual particle animation
     */
    private class ParticleAnimation {
        private PointF position;
        private PointF velocity;
        private float life = 1.0f;
        private float decay = 0.0003f;
        private long startTime;

        ParticleAnimation(float x, float y, float angle) {
            position = new PointF(x, y);

            // Convert angle to radians and calculate velocity
            float radians = (float)Math.toRadians(angle);
            float speed = 2f + (float)Math.random() * 3f;
            velocity = new PointF(
                speed * (float)Math.cos(radians),
                speed * (float)Math.sin(radians)
            );

            startTime = System.currentTimeMillis();
        }

        void start() {
            // Animation already initialized in constructor
        }

        void update(float deltaTime) {
            // Update position
            position.x += velocity.x * deltaTime;
            position.y += velocity.y * deltaTime;

            // Apply gravity
            velocity.y += 9.8f * deltaTime * 0.1f;

            // Apply air resistance
            velocity.x *= 0.99f;
            velocity.y *= 0.99f;

            // Decay life
            life -= decay;
        }

        PointF getPosition() {
            return position;
        }

        boolean isFinished() {
            return life <= 0 || System.currentTimeMillis() - startTime > PARTICLE_LIFETIME;
        }
    }

    /**
     * Easing types for animations
     */
    public enum EasingType {
        LINEAR,
        EASE_IN_OUT,
        EASE_OUT_BOUNCE,
        EASE_OUT_ELASTIC
    }
}
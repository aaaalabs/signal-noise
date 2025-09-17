package app.signalnoise.twa.widget;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.LinearGradient;
import android.graphics.RadialGradient;
import android.graphics.Shader;
import android.graphics.Color;
import android.graphics.BlurMaskFilter;
import android.graphics.PorterDuff;
import android.graphics.PorterDuffXfermode;
import android.graphics.RectF;
import android.graphics.Matrix;
import android.graphics.PathEffect;
import android.graphics.DashPathEffect;
import android.graphics.CornerPathEffect;
import android.graphics.ComposePathEffect;
import android.renderscript.Allocation;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.util.Log;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Signal Wave Advanced Renderer
 *
 * Phase 2: Visual Excellence
 * Implements sophisticated rendering with particle systems,
 * dynamic gradients, and smooth animations
 *
 * Design Philosophy: Living, breathing visualization
 * Performance: Optimized for 60fps with RenderScript acceleration
 */
public class SignalWaveRenderer {

    private static final String TAG = "SignalWaveRenderer";

    // Canvas dimensions
    private static final int CANVAS_WIDTH = 320;
    private static final int CANVAS_HEIGHT = 120;

    // Design constants
    private static final float GOLDEN_RATIO = 1.618f;
    private static final float WAVE_SMOOTHNESS = 0.2f;

    // Performance
    private RenderScript renderScript;
    private ScriptIntrinsicBlur blurScript;
    private ParticleSystem particleSystem;
    private WaveAnimator waveAnimator;

    // State
    private int currentRatio = 80;
    private boolean isPremium = false;
    private long animationTime = 0;

    public SignalWaveRenderer(Context context) {
        initializeRenderScript(context);
        particleSystem = new ParticleSystem();
        waveAnimator = new WaveAnimator();
    }

    /**
     * Initialize RenderScript for GPU acceleration
     */
    private void initializeRenderScript(Context context) {
        try {
            renderScript = RenderScript.create(context);
            blurScript = ScriptIntrinsicBlur.create(renderScript,
                                                    android.renderscript.Element.U8_4(renderScript));
            blurScript.setRadius(4.0f);
        } catch (Exception e) {
            Log.w(TAG, "RenderScript unavailable, falling back to CPU rendering");
        }
    }

    /**
     * Render the complete Signal Wave visualization
     */
    public Bitmap render(WidgetRenderState state) {
        currentRatio = state.ratio;
        isPremium = state.isPremium;
        animationTime = System.currentTimeMillis();

        // Create main canvas
        Bitmap bitmap = Bitmap.createBitmap(CANVAS_WIDTH, CANVAS_HEIGHT, Bitmap.Config.ARGB_8888);
        Canvas canvas = new Canvas(bitmap);

        // Layer 1: Background with dynamic gradient
        drawDynamicBackground(canvas, state);

        // Layer 2: Main wave with glow
        drawMainWave(canvas, state);

        // Layer 3: Secondary harmonic waves
        if (state.ratio >= 70) {
            drawHarmonicWaves(canvas, state);
        }

        // Layer 4: Particle system (premium)
        if (isPremium && state.hasAIInsight) {
            particleSystem.update(animationTime);
            particleSystem.draw(canvas);
        }

        // Layer 5: Energy field visualization
        if (state.ratio >= 85) {
            drawEnergyField(canvas, state);
        }

        // Apply post-processing effects
        return applyPostProcessing(bitmap, state);
    }

    /**
     * Draw dynamic background gradient
     */
    private void drawDynamicBackground(Canvas canvas, WidgetRenderState state) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);

        // Create multi-stop gradient based on productivity
        int[] colors;
        float[] positions;

        if (state.ratio >= 80) {
            // Excellent - subtle green tint
            colors = new int[]{
                Color.parseColor("#0A0A0A"),
                Color.parseColor("#0D1210"),
                Color.parseColor("#050505")
            };
            positions = new float[]{0f, 0.618f, 1f}; // Golden ratio position
        } else if (state.ratio >= 50) {
            // Good - neutral dark
            colors = new int[]{
                Color.parseColor("#0A0A0A"),
                Color.parseColor("#0F0F0F"),
                Color.parseColor("#050505")
            };
            positions = new float[]{0f, 0.5f, 1f};
        } else {
            // Needs focus - subtle warm tint
            colors = new int[]{
                Color.parseColor("#0A0A0A"),
                Color.parseColor("#120D0A"),
                Color.parseColor("#050505")
            };
            positions = new float[]{0f, 0.382f, 1f}; // Inverse golden ratio
        }

        LinearGradient gradient = new LinearGradient(
            0, 0, CANVAS_WIDTH, CANVAS_HEIGHT,
            colors, positions,
            Shader.TileMode.CLAMP
        );

        paint.setShader(gradient);
        canvas.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, paint);

        // Add subtle noise texture for depth
        addNoiseTexture(canvas);
    }

    /**
     * Draw the main productivity wave with advanced effects
     */
    private void drawMainWave(Canvas canvas, WidgetRenderState state) {
        // Calculate wave parameters
        float amplitude = (state.ratio / 100f) * (CANVAS_HEIGHT / 3f);
        float frequency = 0.015f * GOLDEN_RATIO;
        float phase = waveAnimator.getPhase(animationTime);

        // Create wave path
        Path wavePath = createWavePath(amplitude, frequency, phase);

        // Draw glow layer
        Paint glowPaint = new Paint();
        glowPaint.setAntiAlias(true);
        glowPaint.setStyle(Paint.Style.STROKE);
        glowPaint.setStrokeWidth(12f);
        glowPaint.setColor(getWaveColor(state.ratio));
        glowPaint.setAlpha(30);
        if (android.os.Build.VERSION.SDK_INT >= 11) {
            glowPaint.setMaskFilter(new BlurMaskFilter(8f, BlurMaskFilter.Blur.NORMAL));
        }
        canvas.drawPath(wavePath, glowPaint);

        // Draw main wave
        Paint wavePaint = new Paint();
        wavePaint.setAntiAlias(true);
        wavePaint.setStyle(Paint.Style.STROKE);
        wavePaint.setStrokeWidth(2.5f);
        wavePaint.setColor(getWaveColor(state.ratio));

        // Apply smooth corner effect
        PathEffect cornerEffect = new CornerPathEffect(WAVE_SMOOTHNESS * 20f);
        wavePaint.setPathEffect(cornerEffect);

        canvas.drawPath(wavePath, wavePaint);

        // Draw wave fill gradient (subtle)
        Paint fillPaint = new Paint();
        fillPaint.setAntiAlias(true);
        fillPaint.setStyle(Paint.Style.FILL);

        LinearGradient fillGradient = new LinearGradient(
            0, CANVAS_HEIGHT / 2f - amplitude,
            0, CANVAS_HEIGHT,
            getWaveColor(state.ratio),
            Color.TRANSPARENT,
            Shader.TileMode.CLAMP
        );

        fillPaint.setShader(fillGradient);
        fillPaint.setAlpha(20);

        Path fillPath = new Path(wavePath);
        fillPath.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT);
        fillPath.lineTo(0, CANVAS_HEIGHT);
        fillPath.close();

        canvas.drawPath(fillPath, fillPaint);
    }

    /**
     * Create smooth wave path
     */
    private Path createWavePath(float amplitude, float frequency, float phase) {
        Path path = new Path();
        float centerY = CANVAS_HEIGHT / 2f;

        // Start point
        float startY = centerY + amplitude * (float)Math.sin(phase);
        path.moveTo(0, startY);

        // Use quadratic bezier curves for smoother wave
        float prevX = 0;
        float prevY = startY;

        for (int x = 1; x <= CANVAS_WIDTH; x += 2) {
            float y = centerY + amplitude * (float)Math.sin(x * frequency + phase);

            // Control point at midpoint
            float cx = (prevX + x) / 2f;
            float cy = (prevY + y) / 2f;

            path.quadTo(prevX, prevY, cx, cy);

            prevX = x;
            prevY = y;
        }

        // Final point
        path.lineTo(CANVAS_WIDTH, prevY);

        return path;
    }

    /**
     * Draw harmonic waves for high productivity
     */
    private void drawHarmonicWaves(Canvas canvas, WidgetRenderState state) {
        float baseAmplitude = (state.ratio / 100f) * (CANVAS_HEIGHT / 5f);

        // First harmonic - double frequency, half amplitude
        drawHarmonicWave(canvas, baseAmplitude * 0.5f, 0.03f, 0.3f);

        // Second harmonic - triple frequency, third amplitude
        drawHarmonicWave(canvas, baseAmplitude * 0.33f, 0.045f, 0.2f);
    }

    /**
     * Draw individual harmonic wave
     */
    private void drawHarmonicWave(Canvas canvas, float amplitude, float frequency, float alpha) {
        Path path = new Path();
        float centerY = CANVAS_HEIGHT / 2f;
        float phase = waveAnimator.getPhase(animationTime) * 1.5f;

        path.moveTo(0, centerY);

        for (int x = 0; x <= CANVAS_WIDTH; x++) {
            float y = centerY + amplitude * (float)Math.sin(x * frequency + phase);
            path.lineTo(x, y);
        }

        Paint paint = new Paint();
        paint.setAntiAlias(true);
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(1f);
        paint.setColor(Color.parseColor("#00ff88"));
        paint.setAlpha((int)(255 * alpha));
        paint.setPathEffect(new CornerPathEffect(10f));

        canvas.drawPath(path, paint);
    }

    /**
     * Draw energy field for excellent productivity
     */
    private void drawEnergyField(Canvas canvas, WidgetRenderState state) {
        Paint paint = new Paint();
        paint.setAntiAlias(true);

        // Create radial gradient from center
        RadialGradient gradient = new RadialGradient(
            CANVAS_WIDTH / 2f,
            CANVAS_HEIGHT / 2f,
            Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) / 2f,
            new int[]{
                adjustAlpha(getWaveColor(state.ratio), 40),
                adjustAlpha(getWaveColor(state.ratio), 20),
                Color.TRANSPARENT
            },
            new float[]{0f, 0.618f, 1f},
            Shader.TileMode.CLAMP
        );

        paint.setShader(gradient);

        // Pulsing effect
        float scale = 1f + 0.1f * (float)Math.sin(animationTime / 500.0);
        Matrix matrix = new Matrix();
        matrix.setScale(scale, scale, CANVAS_WIDTH / 2f, CANVAS_HEIGHT / 2f);
        gradient.setLocalMatrix(matrix);

        canvas.drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT, paint);
    }

    /**
     * Add subtle noise texture for depth
     */
    private void addNoiseTexture(Canvas canvas) {
        Paint noisePaint = new Paint();
        noisePaint.setAlpha(5);

        Random random = new Random(42); // Fixed seed for consistent pattern

        for (int i = 0; i < 100; i++) {
            float x = random.nextFloat() * CANVAS_WIDTH;
            float y = random.nextFloat() * CANVAS_HEIGHT;
            float radius = random.nextFloat() * 0.5f;

            noisePaint.setColor(random.nextBoolean() ? Color.WHITE : Color.BLACK);
            canvas.drawCircle(x, y, radius, noisePaint);
        }
    }

    /**
     * Apply post-processing effects
     */
    private Bitmap applyPostProcessing(Bitmap bitmap, WidgetRenderState state) {
        if (renderScript == null || !state.isPremium) {
            return bitmap; // No post-processing without RenderScript or premium
        }

        try {
            // Create blur effect for glow
            Bitmap blurred = Bitmap.createBitmap(bitmap.getWidth(), bitmap.getHeight(), bitmap.getConfig());
            Allocation input = Allocation.createFromBitmap(renderScript, bitmap);
            Allocation output = Allocation.createFromBitmap(renderScript, blurred);

            blurScript.setInput(input);
            blurScript.forEach(output);
            output.copyTo(blurred);

            // Blend original with blurred for glow effect
            Canvas canvas = new Canvas(bitmap);
            Paint blendPaint = new Paint();
            blendPaint.setAlpha(30);
            canvas.drawBitmap(blurred, 0, 0, blendPaint);

            blurred.recycle();
            input.destroy();
            output.destroy();

        } catch (Exception e) {
            Log.w(TAG, "Post-processing failed", e);
        }

        return bitmap;
    }

    /**
     * Get wave color based on productivity ratio
     */
    private int getWaveColor(int ratio) {
        if (ratio >= 80) {
            return Color.parseColor("#00ff88"); // Excellent - Signal green
        } else if (ratio >= 60) {
            return Color.parseColor("#66ff66"); // Good - Lighter green
        } else if (ratio >= 40) {
            return Color.parseColor("#ffaa00"); // Warning - Orange
        } else {
            return Color.parseColor("#ff6644"); // Critical - Red-orange
        }
    }

    /**
     * Adjust color alpha
     */
    private int adjustAlpha(int color, int alpha) {
        return (alpha << 24) | (color & 0x00FFFFFF);
    }

    /**
     * Clean up resources
     */
    public void cleanup() {
        if (renderScript != null) {
            renderScript.destroy();
        }
        particleSystem.cleanup();
    }

    /**
     * Particle System for premium visualizations
     */
    private class ParticleSystem {
        private List<Particle> particles = new ArrayList<>();
        private Random random = new Random();
        private static final int MAX_PARTICLES = 20;

        void update(long time) {
            // Remove dead particles
            particles.removeIf(p -> p.isDead());

            // Add new particles if needed
            while (particles.size() < MAX_PARTICLES && isPremium) {
                particles.add(createParticle());
            }

            // Update existing particles
            for (Particle p : particles) {
                p.update(time);
            }
        }

        void draw(Canvas canvas) {
            Paint paint = new Paint();
            paint.setAntiAlias(true);

            for (Particle p : particles) {
                paint.setColor(p.color);
                paint.setAlpha(p.alpha);
                canvas.drawCircle(p.x, p.y, p.radius, paint);
            }
        }

        Particle createParticle() {
            Particle p = new Particle();
            p.x = random.nextFloat() * CANVAS_WIDTH;
            p.y = CANVAS_HEIGHT / 2f + (random.nextFloat() - 0.5f) * 40f;
            p.vx = (random.nextFloat() - 0.5f) * 0.5f;
            p.vy = -random.nextFloat() * 0.3f;
            p.radius = 1f + random.nextFloat() * 1.5f;
            p.life = 1.0f;
            p.decay = 0.005f + random.nextFloat() * 0.01f;
            p.color = getWaveColor(currentRatio);
            return p;
        }

        void cleanup() {
            particles.clear();
        }
    }

    /**
     * Individual particle
     */
    private static class Particle {
        float x, y, vx, vy, radius, life, decay;
        int color, alpha;

        void update(long time) {
            x += vx;
            y += vy;
            life -= decay;
            alpha = (int)(255 * life);
        }

        boolean isDead() {
            return life <= 0 || x < 0 || x > CANVAS_WIDTH || y < 0;
        }
    }

    /**
     * Wave animator for smooth transitions
     */
    private static class WaveAnimator {
        private float basePhase = 0;
        private float phaseSpeed = 0.002f;

        float getPhase(long time) {
            basePhase += phaseSpeed;
            if (basePhase > 2 * Math.PI) {
                basePhase -= 2 * Math.PI;
            }
            return basePhase + (float)Math.sin(time / 1000.0) * 0.5f;
        }
    }

    /**
     * Render state for widget
     */
    public static class WidgetRenderState {
        public int ratio = 80;
        public boolean isPremium = false;
        public boolean hasAIInsight = false;
        public int streak = 0;
        public String status = "Signal";
    }
}
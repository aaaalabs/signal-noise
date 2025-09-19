package app.signalnoise.twa;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Custom Splash Activity implementing Blueprint Reveal animation
 * Matches PWA experience with outline → solid transition (2200ms)
 */
public class SplashActivity extends AppCompatActivity {

    private static final int ANIMATION_DURATION = 2200; // Match PWA timing

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        ImageView outlineIcon = findViewById(R.id.outline_icon);
        ImageView solidIcon = findViewById(R.id.solid_icon);

        // Start Blueprint Reveal animation
        startBlueprintReveal(outlineIcon, solidIcon);
    }

    private void startBlueprintReveal(ImageView outlineIcon, ImageView solidIcon) {
        // Phase 1: Outline appears and holds (0-1540ms)
        AnimatorSet outlinePhase = new AnimatorSet();
        ObjectAnimator outlineAlpha1 = ObjectAnimator.ofFloat(outlineIcon, "alpha", 0f, 1f);
        outlineAlpha1.setDuration(660); // 30% of 2200ms

        ObjectAnimator outlineScale1 = ObjectAnimator.ofFloat(outlineIcon, "scaleX", 0.95f, 1f);
        ObjectAnimator outlineScale2 = ObjectAnimator.ofFloat(outlineIcon, "scaleY", 0.95f, 1f);
        outlineScale1.setDuration(660);
        outlineScale2.setDuration(660);

        // Hold outline visible (660-1540ms = 880ms hold)
        ObjectAnimator outlineHold = ObjectAnimator.ofFloat(outlineIcon, "alpha", 1f, 1f);
        outlineHold.setDuration(880);
        outlineHold.setStartDelay(660);

        // Phase 2: Outline fades to 30% (1540-2200ms)
        ObjectAnimator outlineFade = ObjectAnimator.ofFloat(outlineIcon, "alpha", 1f, 0.3f);
        outlineFade.setDuration(660); // Final 30%
        outlineFade.setStartDelay(1540);

        outlinePhase.playTogether(outlineAlpha1, outlineScale1, outlineScale2);

        // Phase 3: Solid icon appears (1320-2200ms)
        AnimatorSet solidPhase = new AnimatorSet();
        ObjectAnimator solidAlpha = ObjectAnimator.ofFloat(solidIcon, "alpha", 0f, 1f);
        solidAlpha.setDuration(880); // 40% of 2200ms
        solidAlpha.setStartDelay(1320); // 60% into animation

        ObjectAnimator solidScale1 = ObjectAnimator.ofFloat(solidIcon, "scaleX", 0.98f, 1f);
        ObjectAnimator solidScale2 = ObjectAnimator.ofFloat(solidIcon, "scaleY", 0.98f, 1f);
        solidScale1.setDuration(880);
        solidScale2.setDuration(880);
        solidScale1.setStartDelay(1320);
        solidScale2.setStartDelay(1320);

        solidPhase.playTogether(solidAlpha, solidScale1, solidScale2);

        // Complete animation set
        AnimatorSet completeAnimation = new AnimatorSet();
        completeAnimation.playTogether(outlinePhase, outlineHold, outlineFade, solidPhase);

        completeAnimation.addListener(new AnimatorListenerAdapter() {
            @Override
            public void onAnimationEnd(Animator animation) {
                // Launch main TWA activity
                Intent intent = new Intent(SplashActivity.this, LauncherActivity.class);
                startActivity(intent);
                finish();

                // Smooth transition without additional animation
                overridePendingTransition(0, 0);
            }
        });

        completeAnimation.start();
    }
}
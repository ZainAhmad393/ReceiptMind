package com.receiptmind.app.ui.theme

import android.app.Activity
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val DarkColorScheme = darkColorScheme(
    primary = AmberPrimary,
    secondary = AmberGlow,
    tertiary = EmeraldAccent,
    background = InkNavyDark,
    surface = InkNavyCard,
    onPrimary = InkNavyDark,
    onSecondary = InkNavyDark,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun ReceiptMindTheme(
    content: @Composable () -> Unit
) {
    val colorScheme = DarkColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = InkNavyDark.toArgb()
            window.navigationBarColor = InkNavyDark.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

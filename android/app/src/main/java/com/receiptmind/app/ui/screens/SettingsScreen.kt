package com.receiptmind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.ui.theme.*

@Composable
fun SettingsScreen() {
    var insuranceModeEnabled by remember { mutableStateOf(true) }
    var autoBackupEnabled by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(InkNavyDark)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 24.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text(
                text = "Preferences & Security",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "ReceiptMind Native Android v1.0.0 (Production Play Store)",
                fontSize = 13.sp,
                color = TextMuted
            )
        }

        item {
            SettingsCard(
                title = "Vault & Storage Security",
                items = listOf(
                    SettingToggleItem(
                        title = "Insurance Claim Mode",
                        subtitle = "Preserves high-resolution uncompressed original receipts for insurance adjuster compliance",
                        checked = insuranceModeEnabled,
                        onCheckedChange = { insuranceModeEnabled = it }
                    ),
                    SettingToggleItem(
                        title = "Encrypted Local Room DB",
                        subtitle = "All financial records and receipt images stay secure on your device",
                        checked = autoBackupEnabled,
                        onCheckedChange = { autoBackupEnabled = it }
                    )
                )
            )
        }

        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = InkNavyCard),
                shape = RoundedCornerShape(14.dp),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(InkNavyBorder))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.VerifiedUser, contentDescription = null, tint = EmeraldAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Google Play Store Production Ready", fontWeight = FontWeight.Bold, color = TextPrimary)
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "• Package ID: com.receiptmind.app\n• Target SDK: Android 35 (Android 15+ compatible)\n• ML Kit On-Device Text OCR & Offline Heuristic Fallback\n• Room SQLite Database with Coroutines & Jetpack Compose",
                        fontSize = 13.sp,
                        color = TextSecondary,
                        lineHeight = 20.sp
                    )
                }
            }
        }
    }
}

data class SettingToggleItem(
    val title: String,
    val subtitle: String,
    val checked: Boolean,
    val onCheckedChange: (Boolean) -> Unit
)

@Composable
fun SettingsCard(title: String, items: List<SettingToggleItem>) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = InkNavyCard),
        shape = RoundedCornerShape(14.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(InkNavyBorder))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = TextPrimary)
            Spacer(modifier = Modifier.height(12.dp))
            items.forEachIndexed { index, item ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = item.title, fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = TextPrimary)
                        Text(text = item.subtitle, fontSize = 12.sp, color = TextMuted)
                    }
                    Switch(
                        checked = item.checked,
                        onCheckedChange = item.onCheckedChange,
                        colors = SwitchDefaults.colors(checkedThumbColor = AmberPrimary, checkedTrackColor = AmberDark)
                    )
                }
                if (index < items.size - 1) {
                    Divider(color = InkNavyBorder, modifier = Modifier.padding(vertical = 12.dp))
                }
            }
        }
    }
}

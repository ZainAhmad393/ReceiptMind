package com.receiptmind.app.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.data.model.Receipt
import com.receiptmind.app.data.model.WarrantyStatus
import com.receiptmind.app.ui.theme.*

@Composable
fun MetricCard(
    title: String,
    value: String,
    subtitle: String,
    icon: ImageVector,
    iconTint: Color = AmberPrimary,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = InkNavyCard),
        shape = RoundedCornerShape(16.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(InkNavyBorder))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = title.uppercase(),
                    style = MaterialTheme.typography.labelSmall,
                    color = TextSecondary,
                    letterSpacing = 1.sp
                )
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    tint = iconTint,
                    modifier = Modifier.size(20.dp)
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = value,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Spacer(modifier = Modifier.height(4.dp))
            Text(
                text = subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = TextMuted,
                fontSize = 12.sp
            )
        }
    }
}

@Composable
fun WarrantyBadge(status: WarrantyStatus, daysLeft: Int = 0) {
    val (bgColor, textColor, label) = when (status) {
        WarrantyStatus.ExpiringSoon -> Triple(RoseAlert.copy(alpha = 0.2f), RoseAlert, "Action Required (${daysLeft}d)")
        WarrantyStatus.Active -> Triple(EmeraldAccent.copy(alpha = 0.2f), EmeraldAccent, "Active (${daysLeft}d left)")
        WarrantyStatus.Expired -> Triple(TextMuted.copy(alpha = 0.2f), TextMuted, "Expired")
        WarrantyStatus.None -> Triple(Color.Transparent, Color.Transparent, "")
    }

    if (status != WarrantyStatus.None) {
        Box(
            modifier = Modifier
                .clip(RoundedCornerShape(6.dp))
                .background(bgColor)
                .padding(horizontal = 8.dp, vertical = 4.dp)
        ) {
            Text(
                text = label,
                color = textColor,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold
            )
        }
    }
}

@Composable
fun ReceiptRowItem(
    receipt: Receipt,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onClick() },
        colors = CardDefaults.cardColors(containerColor = InkNavyCard),
        shape = RoundedCornerShape(12.dp),
        border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(InkNavyBorder))
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = receipt.storeName,
                        fontWeight = FontWeight.SemiBold,
                        fontSize = 16.sp,
                        color = TextPrimary
                    )
                    if (receipt.hasWarranty) {
                        Spacer(modifier = Modifier.width(8.dp))
                        WarrantyBadge(receipt.getWarrantyStatus(), receipt.getDaysUntilExpiry())
                    }
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = "${receipt.purchaseDate} • ${receipt.category} • ${receipt.paymentMethod}",
                    fontSize = 13.sp,
                    color = TextSecondary
                )
            }
            Text(
                text = "$${String.format("%.2f", receipt.totalAmount)}",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = AmberPrimary
            )
        }
    }
}

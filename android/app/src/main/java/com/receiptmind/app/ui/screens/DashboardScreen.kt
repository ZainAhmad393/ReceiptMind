package com.receiptmind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.data.model.Receipt
import com.receiptmind.app.data.model.WarrantyStatus
import com.receiptmind.app.ui.components.MetricCard
import com.receiptmind.app.ui.components.ReceiptRowItem
import com.receiptmind.app.ui.theme.*

@Composable
fun DashboardScreen(
    receipts: List<Receipt>,
    onScanClick: () -> Unit,
    onViewReceipt: (Receipt) -> Unit,
    onViewWarranties: () -> Unit
) {
    val totalSpending = receipts.sumOf { it.totalAmount }
    val activeWarranties = receipts.count { it.hasWarranty && it.getWarrantyStatus() != WarrantyStatus.Expired }
    val expiringCount = receipts.count { it.hasWarranty && it.getWarrantyStatus() == WarrantyStatus.ExpiringSoon }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(InkNavyDark)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 24.dp, bottom = 100.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Brand Header
        item {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(28.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(AmberPrimary),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Receipt,
                                contentDescription = null,
                                tint = InkNavyDark,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "ReceiptMind",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                    }
                    Text(
                        text = "AI Receipt Scanner & Warranty Vault",
                        fontSize = 12.sp,
                        color = TextMuted
                    )
                }

                FilledTonalButton(
                    onClick = onScanClick,
                    colors = ButtonDefaults.filledTonalButtonColors(
                        containerColor = AmberPrimary,
                        contentColor = InkNavyDark
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.CameraAlt,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(text = "Scan", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Urgent Warranty Alert Banner (if any)
        if (expiringCount > 0) {
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(containerColor = RoseAlert.copy(alpha = 0.15f)),
                    shape = RoundedCornerShape(14.dp),
                    border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(RoseAlert.copy(alpha = 0.4f)))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = null,
                            tint = RoseAlert,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = "Action Required: Warranty Expiring",
                                fontWeight = FontWeight.Bold,
                                color = RoseAlert,
                                fontSize = 14.sp
                            )
                            Text(
                                text = "Sony WH-1000XM5 warranty expires in 12 days. Tap to inspect coverage.",
                                color = TextPrimary,
                                fontSize = 12.sp
                            )
                        }
                        TextButton(onClick = onViewWarranties) {
                            Text("Inspect", color = AmberPrimary, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Metric Cards Grid
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                MetricCard(
                    title = "Total Spending",
                    value = "$${String.format("%,.2f", totalSpending)}",
                    subtitle = "${receipts.size} verified store receipts",
                    icon = Icons.Default.AttachMoney,
                    iconTint = AmberPrimary,
                    modifier = Modifier.weight(1f)
                )
                MetricCard(
                    title = "Active Warranties",
                    value = "$activeWarranties Items",
                    subtitle = if (expiringCount > 0) "$expiringCount expiring soon" else "All covered",
                    icon = Icons.Default.Shield,
                    iconTint = if (expiringCount > 0) RoseAlert else EmeraldAccent,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        // Recent Receipts Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Recent Receipts",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = TextPrimary
                )
                Text(
                    text = "${receipts.size} total",
                    fontSize = 13.sp,
                    color = TextSecondary
                )
            }
        }

        // Receipts List
        items(receipts) { receipt ->
            ReceiptRowItem(
                receipt = receipt,
                onClick = { onViewReceipt(receipt) }
            )
        }
    }
}

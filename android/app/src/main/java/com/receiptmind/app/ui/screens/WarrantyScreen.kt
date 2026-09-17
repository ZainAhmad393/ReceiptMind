package com.receiptmind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Description
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.data.model.Receipt
import com.receiptmind.app.data.model.WarrantyStatus
import com.receiptmind.app.ui.components.WarrantyBadge
import com.receiptmind.app.ui.theme.*

@Composable
fun WarrantyScreen(
    receipts: List<Receipt>,
    onGenerateClaimLetter: (Receipt) -> Unit
) {
    var selectedFilter by remember { mutableStateOf("All") }
    val warrantyReceipts = receipts.filter { it.hasWarranty }

    val filteredList = when (selectedFilter) {
        "Action Required" -> warrantyReceipts.filter { it.getWarrantyStatus() == WarrantyStatus.ExpiringSoon }
        "Active" -> warrantyReceipts.filter { it.getWarrantyStatus() == WarrantyStatus.Active }
        "Expired" -> warrantyReceipts.filter { it.getWarrantyStatus() == WarrantyStatus.Expired }
        else -> warrantyReceipts
    }

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
                text = "Warranty Vault",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Track expiration dates, serial receipts, and insurance coverage",
                fontSize = 13.sp,
                color = TextMuted
            )
        }

        // Filter Pills
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("All", "Action Required", "Active", "Expired").forEach { filter ->
                    val isSelected = selectedFilter == filter
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedFilter = filter },
                        label = { Text(filter) },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = AmberPrimary,
                            selectedLabelColor = InkNavyDark,
                            containerColor = InkNavyCard,
                            labelColor = TextSecondary
                        )
                    )
                }
            }
        }

        // Warranties List
        items(filteredList) { receipt ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = InkNavyCard),
                shape = RoundedCornerShape(14.dp),
                border = CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(InkNavyBorder))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = receipt.storeName,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        WarrantyBadge(receipt.getWarrantyStatus(), receipt.getDaysUntilExpiry())
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = receipt.notes.ifEmpty { "${receipt.warrantyMonths} Months Manufacturer Limited Warranty" },
                        fontSize = 13.sp,
                        color = TextSecondary
                    )

                    Spacer(modifier = Modifier.height(12.dp))
                    Divider(color = InkNavyBorder)
                    Spacer(modifier = Modifier.height(12.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Expires on: ${receipt.warrantyExpiryDate ?: "N/A"}",
                                fontSize = 12.sp,
                                color = TextMuted
                            )
                            Text(
                                text = "Original Value: $${String.format("%.2f", receipt.totalAmount)}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = AmberPrimary
                            )
                        }

                        OutlinedButton(
                            onClick = { onGenerateClaimLetter(receipt) },
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = AmberPrimary),
                            border = ButtonDefaults.outlinedButtonBorder.copy(brush = androidx.compose.ui.graphics.SolidColor(AmberPrimary))
                        ) {
                            Icon(Icons.Default.Description, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text("Claim Notice")
                        }
                    }
                }
            }
        }
    }
}

package com.receiptmind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.data.model.Receipt
import com.receiptmind.app.ui.components.ReceiptRowItem
import com.receiptmind.app.ui.theme.*

@Composable
fun LibraryScreen(
    receipts: List<Receipt>,
    onReceiptClick: (Receipt) -> Unit
) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }

    val categories = listOf("All", "Electronics", "Groceries", "Home & Furniture", "Dining")

    val filtered = receipts.filter { receipt ->
        val matchesQuery = receipt.storeName.contains(searchQuery, ignoreCase = true) ||
                receipt.notes.contains(searchQuery, ignoreCase = true)
        val matchesCategory = selectedCategory == "All" || receipt.category == selectedCategory
        matchesQuery && matchesCategory
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
                text = "Receipt Library",
                fontSize = 26.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Searchable proof-of-purchase repository",
                fontSize = 13.sp,
                color = TextMuted
            )
        }

        // Search Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                modifier = Modifier.fillMaxWidth(),
                placeholder = { Text("Search by merchant, model, serial...", color = TextMuted) },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = AmberPrimary) },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InkNavyCard,
                    unfocusedContainerColor = InkNavyCard,
                    focusedBorderColor = AmberPrimary,
                    unfocusedBorderColor = InkNavyBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                shape = RoundedCornerShape(12.dp)
            )
        }

        // Categories Row
        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(categories) { cat ->
                    FilterChip(
                        selected = selectedCategory == cat,
                        onClick = { selectedCategory = cat },
                        label = { Text(cat) },
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

        items(filtered) { receipt ->
            ReceiptRowItem(
                receipt = receipt,
                onClick = { onReceiptClick(receipt) }
            )
        }
    }
}

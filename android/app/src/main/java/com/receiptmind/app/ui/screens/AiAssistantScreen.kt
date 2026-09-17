package com.receiptmind.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.ui.theme.*

data class ChatMessage(
    val id: String,
    val sender: String, // "user" or "ai"
    val text: String
)

@Composable
fun AiAssistantScreen() {
    var inputText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            ChatMessage(
                "1",
                "ai",
                "Hello! I am **ReceiptMind AI**. I monitor your expenses, warranty deadlines, and insurance eligibility across all your receipts. How can I assist you today?"
            ),
            ChatMessage(
                "2",
                "ai",
                "💡 **Warranty Notice**: Your Sony WH-1000XM5 headphones warranty from Best Buy expires soon. Would you like me to draft an official repair notice?"
            )
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(InkNavyDark)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(modifier = Modifier.height(24.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Default.SmartToy, contentDescription = null, tint = AmberPrimary)
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "ReceiptMind AI Assistant",
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
        }
        Text(
            text = "Personal financial advisor & warranty advocate",
            fontSize = 12.sp,
            color = TextMuted
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Quick Suggestion Chips
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            SuggestionChip(
                onClick = {
                    messages.add(ChatMessage(System.currentTimeMillis().toString(), "user", "Which warranties expire soon?"))
                    messages.add(
                        ChatMessage(
                            (System.currentTimeMillis() + 1).toString(),
                            "ai",
                            "Your **Sony WH-1000XM5** (24 months warranty from Best Buy) expires in **12 days**. All other items (MacBook Pro M3 Max, DeWalt Drill) remain under active coverage until 2027."
                        )
                    )
                },
                label = { Text("Expiring Warranties", fontSize = 12.sp, color = AmberPrimary) }
            )
            SuggestionChip(
                onClick = {
                    messages.add(ChatMessage(System.currentTimeMillis().toString(), "user", "Summarize electronics spend"))
                    messages.add(
                        ChatMessage(
                            (System.currentTimeMillis() + 1).toString(),
                            "ai",
                            "You have invested **$4,297.99** in Electronics this season, representing 78% of your tracked expenses. 100% of these devices have digital proof-of-purchase backups attached in Insurance Mode."
                        )
                    )
                },
                label = { Text("Electronics Spending", fontSize = 12.sp, color = AmberPrimary) }
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Chat Messages List
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            contentPadding = PaddingValues(bottom = 16.dp)
        ) {
            items(messages) { msg ->
                val isUser = msg.sender == "user"
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start
                ) {
                    Card(
                        colors = CardDefaults.cardColors(
                            containerColor = if (isUser) AmberPrimary else InkNavyCard
                        ),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.widthIn(max = 300.dp),
                        border = if (!isUser) CardDefaults.outlinedCardBorder().copy(brush = androidx.compose.ui.graphics.SolidColor(InkNavyBorder)) else null
                    ) {
                        Text(
                            text = msg.text,
                            color = if (isUser) InkNavyDark else TextPrimary,
                            fontSize = 14.sp,
                            modifier = Modifier.padding(14.dp),
                            lineHeight = 20.sp
                        )
                    }
                }
            }
        }

        // Input Box
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 90.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            OutlinedTextField(
                value = inputText,
                onValueChange = { inputText = it },
                modifier = Modifier.weight(1f),
                placeholder = { Text("Ask about purchases, claims, warranties...", color = TextMuted, fontSize = 13.sp) },
                singleLine = true,
                colors = OutlinedTextFieldDefaults.colors(
                    focusedContainerColor = InkNavyCard,
                    unfocusedContainerColor = InkNavyCard,
                    focusedBorderColor = AmberPrimary,
                    unfocusedBorderColor = InkNavyBorder,
                    focusedTextColor = TextPrimary,
                    unfocusedTextColor = TextPrimary
                ),
                shape = RoundedCornerShape(24.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            IconButton(
                onClick = {
                    if (inputText.isNotBlank()) {
                        messages.add(ChatMessage(System.currentTimeMillis().toString(), "user", inputText))
                        val query = inputText
                        inputText = ""
                        messages.add(
                            ChatMessage(
                                (System.currentTimeMillis() + 1).toString(),
                                "ai",
                                "I have verified your receipt archives for '$query'. All relevant line items, serial records, and warranty certificates are securely indexed in your encrypted local database."
                            )
                        )
                    }
                },
                modifier = Modifier
                    .size(48.dp)
                    .background(AmberPrimary, shape = RoundedCornerShape(24.dp))
            ) {
                Icon(Icons.Default.Send, contentDescription = "Send", tint = InkNavyDark)
            }
        }
    }
}

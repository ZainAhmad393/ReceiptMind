package com.receiptmind.app.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.receiptmind.app.data.model.Receipt
import com.receiptmind.app.ui.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun ScanScreen(
    onReceiptSaved: (Receipt) -> Unit,
    onCancel: () -> Unit
) {
    var isScanning by remember { mutableStateOf(false) }
    var detectedStore by remember { mutableStateOf<String?>(null) }
    var detectedTotal by remember { mutableStateOf<Double?>(null) }
    val scope = rememberCoroutineScope()

    // Scanner beam animation
    val infiniteTransition = rememberInfiniteTransition(label = "laser")
    val laserOffset by infiniteTransition.animateFloat(
        initialValue = 0.1f,
        targetValue = 0.9f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "laserY"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(InkNavyDark)
    ) {
        // Mock Camera Viewport / Guide Box
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = "Align Receipt Within Frame",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = TextPrimary
            )
            Text(
                text = "Auto-detects totals, date, tax, and manufacturer warranties",
                fontSize = 13.sp,
                color = TextSecondary
            )

            Spacer(modifier = Modifier.height(28.dp))

            // Viewfinder box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(420.dp)
                    .clip(RoundedCornerShape(20.dp))
                    .background(InkNavyCard.copy(alpha = 0.6f))
                    .border(2.dp, AmberPrimary.copy(alpha = 0.8f), RoundedCornerShape(20.dp))
            ) {
                // Animated Golden Laser Beam
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(4.dp)
                        .align(Alignment.TopCenter)
                        .offset(y = (420 * laserOffset).dp)
                        .background(
                            Brush.horizontalGradient(
                                listOf(
                                    Color.Transparent,
                                    AmberPrimary,
                                    AmberGlow,
                                    AmberPrimary,
                                    Color.Transparent
                                )
                            )
                        )
                )

                // Corner brackets visual indicators
                Text(
                    text = "ReceiptMind AI Engine Active",
                    color = AmberPrimary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .padding(top = 12.dp)
                )
            }

            Spacer(modifier = Modifier.height(36.dp))

            // Action Controls
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Cancel
                IconButton(
                    onClick = onCancel,
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(InkNavyCard)
                ) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = "Cancel",
                        tint = TextSecondary
                    )
                }

                // Shutter Button
                Button(
                    onClick = {
                        isScanning = true
                        scope.launch {
                            delay(1200) // Simulated ML Kit processing
                            val simulatedReceipt = Receipt(
                                storeName = "Target Store #1294",
                                purchaseDate = "2026-09-10",
                                totalAmount = 149.99,
                                taxAmount = 12.50,
                                category = "Home & Furniture",
                                paymentMethod = "Google Pay (*3310)",
                                hasWarranty = true,
                                warrantyMonths = 12,
                                warrantyExpiryDate = "2027-09-10",
                                notes = "Ninja Air Fryer Pro XL. 1-Year Manufacturer Warranty."
                            )
                            onReceiptSaved(simulatedReceipt)
                        }
                    },
                    modifier = Modifier.size(76.dp),
                    shape = CircleShape,
                    colors = ButtonDefaults.buttonColors(containerColor = AmberPrimary),
                    contentPadding = PaddingValues(0.dp)
                ) {
                    if (isScanning) {
                        CircularProgressIndicator(
                            color = InkNavyDark,
                            modifier = Modifier.size(32.dp),
                            strokeWidth = 3.dp
                        )
                    } else {
                        Icon(
                            imageVector = Icons.Default.CameraAlt,
                            contentDescription = "Capture",
                            tint = InkNavyDark,
                            modifier = Modifier.size(36.dp)
                        )
                    }
                }

                // Gallery picker
                IconButton(
                    onClick = {
                        val simulatedReceipt = Receipt(
                            storeName = "Costco Wholesale",
                            purchaseDate = "2026-09-08",
                            totalAmount = 289.50,
                            taxAmount = 22.10,
                            category = "Electronics",
                            paymentMethod = "Visa (*9902)",
                            hasWarranty = true,
                            warrantyMonths = 24,
                            warrantyExpiryDate = "2028-09-08",
                            notes = "Bose QuietComfort Earphones. Costco 2-Year Concierge Warranty."
                        )
                        onReceiptSaved(simulatedReceipt)
                    },
                    modifier = Modifier
                        .size(52.dp)
                        .clip(CircleShape)
                        .background(InkNavyCard)
                ) {
                    Icon(
                        imageVector = Icons.Default.PhotoLibrary,
                        contentDescription = "Gallery",
                        tint = TextSecondary
                    )
                }
            }
        }
    }
}

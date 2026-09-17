package com.receiptmind.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale

@Entity(tableName = "receipts")
data class Receipt(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val storeName: String,
    val purchaseDate: String, // YYYY-MM-DD
    val totalAmount: Double,
    val taxAmount: Double = 0.0,
    val subtotalAmount: Double = totalAmount - taxAmount,
    val currency: String = "USD",
    val paymentMethod: String = "Apple Pay",
    val category: String = "Electronics",
    val imageUri: String? = null,
    val notes: String = "",
    val hasWarranty: Boolean = false,
    val warrantyMonths: Int = 0,
    val warrantyExpiryDate: String? = null, // YYYY-MM-DD
    val isArchived: Boolean = false,
    val isInsuranceMode: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
) {
    fun getWarrantyStatus(): WarrantyStatus {
        if (!hasWarranty || warrantyExpiryDate == null) return WarrantyStatus.None

        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val expiry = try { sdf.parse(warrantyExpiryDate) } catch (e: Exception) { null } ?: return WarrantyStatus.None
        val now = Date()

        val cal = Calendar.getInstance()
        cal.time = now
        cal.add(Calendar.DAY_OF_YEAR, 30) // 30 days warning window
        val warningThreshold = cal.time

        return when {
            expiry.before(now) -> WarrantyStatus.Expired
            expiry.before(warningThreshold) -> WarrantyStatus.ExpiringSoon
            else -> WarrantyStatus.Active
        }
    }

    fun getDaysUntilExpiry(): Int {
        if (!hasWarranty || warrantyExpiryDate == null) return 0
        val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.US)
        val expiry = try { sdf.parse(warrantyExpiryDate) } catch (e: Exception) { null } ?: return 0
        val diff = expiry.time - System.currentTimeMillis()
        return (diff / (1000 * 60 * 60 * 24)).toInt().coerceAtLeast(0)
    }
}

enum class WarrantyStatus {
    None,
    Active,
    ExpiringSoon,
    Expired
}

data class ReceiptItem(
    val name: String,
    val price: Double,
    val category: String = "Other",
    val likelyHasWarranty: Boolean = false,
    val estimatedWarrantyMonths: Int = 0
)

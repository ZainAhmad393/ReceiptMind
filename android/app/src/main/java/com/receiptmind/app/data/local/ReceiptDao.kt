package com.receiptmind.app.data.local

import androidx.room.*
import com.receiptmind.app.data.model.Receipt
import kotlinx.coroutines.flow.Flow

@Dao
interface ReceiptDao {
    @Query("SELECT * FROM receipts ORDER BY purchaseDate DESC")
    fun getAllReceipts(): Flow<List<Receipt>>

    @Query("SELECT * FROM receipts WHERE hasWarranty = 1 ORDER BY warrantyExpiryDate ASC")
    fun getWarrantyReceipts(): Flow<List<Receipt>>

    @Query("SELECT * FROM receipts WHERE id = :id")
    suspend fun getReceiptById(id: Long): Receipt?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReceipt(receipt: Receipt): Long

    @Update
    suspend fun updateReceipt(receipt: Receipt)

    @Delete
    suspend fun deleteReceipt(receipt: Receipt)

    @Query("SELECT SUM(totalAmount) FROM receipts")
    fun getTotalSpending(): Flow<Double?>

    @Query("SELECT COUNT(*) FROM receipts")
    fun getReceiptCount(): Flow<Int>
}

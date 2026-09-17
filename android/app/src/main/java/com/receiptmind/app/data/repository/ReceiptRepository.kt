package com.receiptmind.app.data.repository

import com.receiptmind.app.data.local.ReceiptDao
import com.receiptmind.app.data.model.Receipt
import kotlinx.coroutines.flow.Flow

class ReceiptRepository(private val receiptDao: ReceiptDao) {
    val allReceipts: Flow<List<Receipt>> = receiptDao.getAllReceipts()
    val warrantyReceipts: Flow<List<Receipt>> = receiptDao.getWarrantyReceipts()
    val totalSpending: Flow<Double?> = receiptDao.getTotalSpending()
    val receiptCount: Flow<Int> = receiptDao.getReceiptCount()

    suspend fun insert(receipt: Receipt): Long {
        return receiptDao.insertReceipt(receipt)
    }

    suspend fun update(receipt: Receipt) {
        receiptDao.updateReceipt(receipt)
    }

    suspend fun delete(receipt: Receipt) {
        receiptDao.deleteReceipt(receipt)
    }

    suspend fun getById(id: Long): Receipt? {
        return receiptDao.getReceiptById(id)
    }
}

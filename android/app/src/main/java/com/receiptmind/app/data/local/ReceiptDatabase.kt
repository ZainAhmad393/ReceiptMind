package com.receiptmind.app.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import com.receiptmind.app.data.model.Receipt
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(entities = [Receipt::class], version = 1, exportSchema = false)
abstract class ReceiptDatabase : RoomDatabase() {
    abstract fun receiptDao(): ReceiptDao

    companion object {
        @Volatile
        private var INSTANCE: ReceiptDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): ReceiptDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    ReceiptDatabase::class.java,
                    "receiptmind.db"
                )
                .addCallback(ReceiptDatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }

        private class ReceiptDatabaseCallback(
            private val scope: CoroutineScope
        ) : RoomDatabase.Callback() {
            override fun onCreate(db: SupportSQLiteDatabase) {
                super.onCreate(db)
                INSTANCE?.let { database ->
                    scope.launch(Dispatchers.IO) {
                        populateInitialData(database.receiptDao())
                    }
                }
            }

            suspend fun populateInitialData(dao: ReceiptDao) {
                dao.insertReceipt(
                    Receipt(
                        storeName = "Best Buy Store #482",
                        purchaseDate = "2024-09-15",
                        totalAmount = 475.20,
                        taxAmount = 37.23,
                        category = "Electronics",
                        paymentMethod = "Apple Pay (Visa *4921)",
                        hasWarranty = true,
                        warrantyMonths = 24,
                        warrantyExpiryDate = "2026-09-15",
                        notes = "Sony WH-1000XM5 Wireless Headphones. Active 2-Year Manufacturer Warranty."
                    )
                )
                dao.insertReceipt(
                    Receipt(
                        storeName = "Apple Store - Fifth Ave",
                        purchaseDate = "2024-08-10",
                        totalAmount = 3898.00,
                        taxAmount = 312.00,
                        category = "Electronics",
                        paymentMethod = "Apple Card (*8821)",
                        hasWarranty = true,
                        warrantyMonths = 36,
                        warrantyExpiryDate = "2027-08-10",
                        notes = "MacBook Pro 16\" M3 Max + AppleCare+ 3-Year Protection Plan."
                    )
                )
                dao.insertReceipt(
                    Receipt(
                        storeName = "The Home Depot",
                        purchaseDate = "2024-05-20",
                        totalAmount = 249.00,
                        taxAmount = 21.15,
                        category = "Home & Furniture",
                        paymentMethod = "Chase Sapphire (*1104)",
                        hasWarranty = true,
                        warrantyMonths = 36,
                        warrantyExpiryDate = "2027-05-20",
                        notes = "DeWalt 20V MAX Cordless Drill Combo Kit. 3-Year Limited Warranty."
                    )
                )
                dao.insertReceipt(
                    Receipt(
                        storeName = "Whole Foods Market",
                        purchaseDate = "2024-09-08",
                        totalAmount = 185.40,
                        taxAmount = 12.40,
                        category = "Groceries",
                        paymentMethod = "Debit Card (*7231)",
                        hasWarranty = false,
                        notes = "Weekly organic pantry restock."
                    )
                )
            }
        }
    }
}

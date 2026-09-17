package com.receiptmind.app.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import androidx.lifecycle.lifecycleScope
import com.receiptmind.app.data.local.ReceiptDatabase
import com.receiptmind.app.data.model.Receipt
import com.receiptmind.app.data.repository.ReceiptRepository
import com.receiptmind.app.ui.screens.*
import com.receiptmind.app.ui.theme.InkNavyCard
import com.receiptmind.app.ui.theme.InkNavyDark
import com.receiptmind.app.ui.theme.ReceiptMindTheme
import com.receiptmind.app.ui.theme.AmberPrimary
import com.receiptmind.app.ui.theme.TextMuted
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch

sealed class Screen(val route: String, val title: String, val icon: ImageVector) {
    object Dashboard : Screen("dashboard", "Home", Icons.Default.Dashboard)
    object Scan : Screen("scan", "Scan", Icons.Default.CameraAlt)
    object Warranties : Screen("warranties", "Warranties", Icons.Default.Shield)
    object Library : Screen("library", "Library", Icons.Default.Folder)
    object AiChat : Screen("ai_chat", "Assistant", Icons.Default.SmartToy)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
}

class MainActivity : ComponentActivity() {

    private lateinit var repository: ReceiptRepository

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val database = ReceiptDatabase.getDatabase(this, lifecycleScope)
        repository = ReceiptRepository(database.receiptDao())

        setContent {
            ReceiptMindTheme {
                MainAppScaffold(repository = repository)
            }
        }
    }
}

@Composable
fun MainAppScaffold(repository: ReceiptRepository) {
    var currentScreen by remember { mutableStateOf<Screen>(Screen.Dashboard) }
    val receipts by repository.allReceipts.collectAsState(initial = emptyList())
    val coroutineScope = rememberCoroutineScope()

    val bottomNavItems = listOf(
        Screen.Dashboard,
        Screen.Scan,
        Screen.Warranties,
        Screen.Library,
        Screen.AiChat
    )

    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = InkNavyCard,
                tonalElevation = 8.dp
            ) {
                bottomNavItems.forEach { screen ->
                    val selected = currentScreen == screen
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.title) },
                        label = { Text(screen.title) },
                        selected = selected,
                        onClick = { currentScreen = screen },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = InkNavyDark,
                            selectedTextColor = AmberPrimary,
                            indicatorColor = AmberPrimary,
                            unselectedIconColor = TextMuted,
                            unselectedTextColor = TextMuted
                        )
                    )
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentScreen) {
                is Screen.Dashboard -> {
                    DashboardScreen(
                        receipts = receipts,
                        onScanClick = { currentScreen = Screen.Scan },
                        onViewReceipt = { /* Open receipt details */ },
                        onViewWarranties = { currentScreen = Screen.Warranties }
                    )
                }
                is Screen.Scan -> {
                    ScanScreen(
                        onReceiptSaved = { newReceipt ->
                            coroutineScope.launch {
                                repository.insert(newReceipt)
                                currentScreen = Screen.Dashboard
                            }
                        },
                        onCancel = { currentScreen = Screen.Dashboard }
                    )
                }
                is Screen.Warranties -> {
                    WarrantyScreen(
                        receipts = receipts,
                        onGenerateClaimLetter = { /* Open claim letter generator */ }
                    )
                }
                is Screen.Library -> {
                    LibraryScreen(
                        receipts = receipts,
                        onReceiptClick = { /* View details */ }
                    )
                }
                is Screen.AiChat -> {
                    AiAssistantScreen()
                }
                is Screen.Settings -> {
                    SettingsScreen()
                }
            }
        }
    }
}

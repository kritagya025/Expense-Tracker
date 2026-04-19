let totalIncome = 0;
let totalExpenses = 0;
let transactions = []; 
let categories = ["Food", "Travel", "Rent", "Others"];

function updateSummary() {
  const remainingBalance = totalIncome - totalExpenses;
  
  // Visual Feedback Animation
  const el = document.getElementById("remaining-balance-display");
  el.classList.add('animate__animated', 'animate__headShake');
  setTimeout(() => el.classList.remove('animate__animated', 'animate__headShake'), 1000);

  document.getElementById("total-income-display").textContent = `₹${totalIncome.toFixed(2)}`;
  document.getElementById("total-expenses-display").textContent = `₹${totalExpenses.toFixed(2)}`;
  document.getElementById("remaining-balance-display").textContent = `₹${remainingBalance.toFixed(2)}`;
}

function addExpense() {
  const expenseTitle = document.getElementById("solo-expense-title").value;
  const expenseAmount = parseFloat(document.getElementById("solo-expense-amount").value);
  const expenseCategory = document.getElementById("solo-expense-category").value;

  if (!expenseTitle || !expenseAmount || !expenseCategory) {
    alert("Please fill out all fields.");
    return;
  }

  const dateTime = new Date().toLocaleString();
  totalExpenses += expenseAmount;
  transactions.push({
    title: expenseTitle,
    amount: expenseAmount,
    category: expenseCategory,
    dateTime: dateTime, 
  });

  document.getElementById("solo-expense-title").value = "";
  document.getElementById("solo-expense-amount").value = "";
  document.getElementById("solo-expense-category").value = "";

  updateSummary();
  displayTransactionHistory();
  updateExpenseChart();
}

function displayTransactionHistory() {
  const filterCategory = document.getElementById("history-filter").value;
  const historyList = document.getElementById("transaction-history-list");
  historyList.innerHTML = ""; 

  if (transactions.length === 0) {
    historyList.innerHTML = `<div class="text-center py-10 text-slate-600">No transactions logged.</div>`;
    return;
  }

  [...transactions].reverse().forEach((transaction, index) => {
    if (filterCategory === "" || transaction.category === filterCategory) {
      const listItem = document.createElement("li");
      listItem.className = "flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 animate__animated animate__fadeInUp";
      listItem.style.animationDelay = `${index * 0.05}s`;
      
      listItem.innerHTML = `
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-lg">
                ${getCategoryIcon(transaction.category)}
            </div>
            <div>
                <p class="font-bold text-white">${transaction.title}</p>
                <p class="text-[10px] text-slate-500 font-mono">${transaction.dateTime}</p>
            </div>
        </div>
        <div class="text-right">
            <p class="text-lg font-bold text-red-400">-₹${transaction.amount.toFixed(2)}</p>
            <span class="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-slate-400 uppercase font-bold">${transaction.category}</span>
        </div>
      `;
      historyList.appendChild(listItem);
    }
  });
}

function getCategoryIcon(cat) {
    const icons = {'Food': '🍔', 'Travel': '🚗', 'Rent': '🏠', 'Others': '✨'};
    return icons[cat] || '💰';
}

function updateExpenseChart() {
  const categoriesTotal = { Food: 0, Travel: 0, Rent: 0, Others: 0 };
  transactions.forEach(t => categoriesTotal[t.category] += t.amount);

  const ctx = document.getElementById("expensePieChartCanvas").getContext("2d");
  if (window.expenseChart) window.expenseChart.destroy();

  window.expenseChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: categories,
      datasets: [{
        data: [categoriesTotal.Food, categoriesTotal.Travel, categoriesTotal.Rent, categoriesTotal.Others],
        backgroundColor: ["#4ade80", "#3b82f6", "#ef4444", "#f59e0b"],
        borderWidth: 0,
      }],
    },
    options: { cutout: '80%', plugins: { legend: { display: false } } }
  });
}

function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("BudgetBuddy Expense Report", 20, 20);
  doc.text(`Total Balance: ₹${(totalIncome - totalExpenses).toFixed(2)}`, 20, 30);
  transactions.forEach((t, i) => {
    doc.text(`${t.title}: ₹${t.amount} (${t.category})`, 20, 50 + (i * 10));
  });
  doc.save("report.pdf");
}

function resetAll() {
  if (confirm("Clear all data?")) {
    totalIncome = 0; totalExpenses = 0; transactions = [];
    updateSummary(); displayTransactionHistory(); updateExpenseChart();
  }
}

function setTotalIncome() {
  const income = parseFloat(document.getElementById("total-income-input").value);
  if (!isNaN(income) && income > 0) {
    totalIncome = income;
    document.getElementById("total-income-input").value = "";
    updateSummary();
  }
}

function displayDateTime() {
  const options = { weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  document.getElementById("current-date-time").textContent = new Date().toLocaleString('en-US', options);
}

document.getElementById("set-income").addEventListener("click", setTotalIncome);
document.getElementById("add-solo-expense").addEventListener("click", addExpense);
document.getElementById("history-filter").addEventListener("change", displayTransactionHistory);
document.getElementById("download-pdf").addEventListener("click", downloadPDF);
document.getElementById("reset-all").addEventListener("click", resetAll);

setInterval(displayDateTime, 1000);
displayDateTime();
updateSummary();
displayTransactionHistory();
updateExpenseChart();
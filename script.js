window.onbeforeunload = function (event) {
  const message = "Are you sure you want to leave? You may lose unsaved changes.";
  event.returnValue = message;
  return message;
};

let items = {  // Object to store item names, rates, and counts with pre-populated items
  "Samosa": { rate: 25, count: 0 },
  "Poha": { rate: 20, count: 0 },
  "Coke": { rate: 20, count: 0 },
  "Milk": { rate: 20, count: 0 },
  "Maggi": { rate: 30, count: 0 }
};

function downloadItems() {
  const itemData = [];
  for (const itemName in items) {
    const item = items[itemName];
    itemData.push(`${itemName}\t\t${item.count}\t\t${item.rate.toFixed(2)}`);
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString();
  const formattedTime = now.toLocaleTimeString();

  const content = `Item\t\tCount\t\tRate\n
${itemData.join("\n")}

Total Amount: ₹${calculateTotalAmount().toFixed(2)}

Happy Birthday! Thank you for the party!

Generated on: ${formattedDate} ${formattedTime}`;

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "chandu_order_receipt.txt";
  link.click();

  // Optional: Revoke the object URL to avoid memory leaks
  window.URL.revokeObjectURL(url);
}

function calculateTotalAmount() {
  let total = 0;
  for (const itemName in items) {
    total += items[itemName].rate * items[itemName].count;
  }
  return total;
}

function addItem() {
  const newItemName = document.getElementById("new-item").value.trim();
  const newRate = parseFloat(document.getElementById("new-rate").value);
  if (!newItemName || isNaN(newRate)) return;  // Ignore empty input or invalid rate

  if (!items[newItemName]) {
    items[newItemName] = { rate: newRate, count: 0 };
    createListItem(newItemName);
  } else {
    alert("Item already exists!");
  }
  document.getElementById("new-item").value = "";
  document.getElementById("new-rate").value = "";  // Clear rate input field
  updateTotalAmount();
}

function createListItem(itemName) {
  const list = document.getElementById("item-list");
  const listItem = document.createElement("li");
  listItem.textContent = itemName;

  const countSpan = document.createElement("span");
  countSpan.textContent = ` (0)`;
  countSpan.id = `count-${itemName}`;
  listItem.appendChild(countSpan);

  const rateSpan = document.createElement("span");
  rateSpan.textContent = ` (${items[itemName].rate.toFixed(2)})`;
  rateSpan.id = `rate-${itemName}`;
  listItem.appendChild(rateSpan);

  const buttonContainer = document.createElement("span");
  buttonContainer.classList.add("button-container");

  const incrementButton = document.createElement("button");
  incrementButton.textContent = "+";
  incrementButton.onclick = function() {
    incrementCount(itemName);
  };
  buttonContainer.appendChild(incrementButton);

  const decrementButton = document.createElement("button");
  decrementButton.textContent = "-";
  decrementButton.onclick = function() {
    decrementCount(itemName);
  };
  buttonContainer.appendChild(decrementButton);

  listItem.appendChild(buttonContainer);

  const removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  removeButton.onclick = function() {
    removeItem(itemName);
  };
  listItem.appendChild(removeButton);

  list.appendChild(listItem);
}

function incrementCount(itemName) {
  items[itemName].count++;
  document.getElementById(`count-${itemName}`).textContent = ` (${items[itemName].count})`;
  updateTotalAmount();
}

function decrementCount(itemName) {
  if (items[itemName].count > 0) {
    items[itemName].count--;
  }
  document.getElementById(`count-${itemName}`).textContent = ` (${items[itemName].count})`;
  updateTotalAmount();
}

function removeItem(itemName) {
  delete items[itemName];
  const listItem = document.getElementById(`count-${itemName}`).parentElement;
  listItem.parentNode.removeChild(listItem);
  updateTotalAmount();
}

function updateTotalAmount() {
  let total = 0;
  for (const itemName in items) {
    total += items[itemName].rate * items[itemName].count;
  }
  // Replace dollar sign with rupee sign
  document.getElementById("total-amount").textContent = `Total Amount: ₹${total.toFixed(2)}`;
}

// Call createListItem for pre-populated items to display them initially
for (const itemName in items) {
  createListItem(itemName);
}
updateTotalAmount();  // Update total after creating default items


        // Formula 1: Initialize Logic
        let records = JSON.parse(localStorage.getItem('custRecords')) || [];
        window.onload = renderHistory;

        // Formula 2: Save and Display
        function saveRecord() {
            const nameInput = document.getElementById('name').value;
            const dateInput = document.getElementById('date').value;

            if(!nameInput || !dateInput) {
                alert("Please enter Name and Date");
                return;
            }

            const data = {
                id: Date.now(), // Unique ID for deleting
                name: nameInput,
                date: dateInput,
                cycle: document.getElementById('cycle').value,
                amount: document.getElementById('amount').value,
                prod: document.getElementById('prod').value,
                details: document.getElementById('details').value
            };

            // Calculate next date
            let nextDate = new Date(data.date);
            nextDate.setDate(nextDate.getDate() + parseInt(data.cycle));
            data.nextDateStr = nextDate.toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' });

            records.push(data);
            localStorage.setItem('custRecords', JSON.stringify(records));
            
            renderHistory();
            showInAnotherDisplay(data);
        }

        // Formula 3: Render the List
        function renderHistory() {
            const list = document.getElementById('history-list');
            list.innerHTML = ""; 

            // Show newest at the top
            records.slice().reverse().forEach(r => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <div onclick="showInAnotherDisplayById(${r.id})">
                        <b>${r.name}</b> <span style="color:#888; font-size:11px;">(${r.details || r.prod})</span><br>
                        <small style="color:var(--pink)">Next: ${r.nextDateStr}</small>
                    </div>
                    <i class="del-icon" onclick="deleteRecord(event, ${r.id})">🗑</i>
                `;
                list.appendChild(div);
            });
        }

        // Formula 4: Delete Logic
        function deleteRecord(event, id) {
            event.stopPropagation(); // Prevents the "Click to View" from opening
            if(confirm("Are you sure you want to delete this record?")) {
                records = records.filter(item => item.id !== id);
                localStorage.setItem('custRecords', JSON.stringify(records));
                renderHistory();
            }
        }

        // Formula 5: Manage "Another Display"
        function showInAnotherDisplay(r) {
            const display = document.getElementById('details-display');
            const overlay = document.getElementById('overlay');
            const content = document.getElementById('display-content');
            
            content.innerHTML = `
                <p><strong>Customer:</strong> ${r.name}</p>
                <p><strong>Product:</strong> ${r.prod}</p>
                <p><strong>Details:</strong> ${r.details}</p>
                <p><strong>Amount:</strong> ${r.amount || '0.00'}</p>
                <hr style="border:0; border-top:1px solid #eee">
                <p style="color:var(--pink)"><strong>Next Service Date:</strong><br>${r.nextDateStr}</p>
            `;
            display.style.display = 'block';
            overlay.style.display = 'block';
        }

        function showInAnotherDisplayById(id) {
            const record = records.find(r => r.id === id);
            if(record) showInAnotherDisplay(record);
        }

        function closeDisplay() {
            document.getElementById('details-display').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }
  
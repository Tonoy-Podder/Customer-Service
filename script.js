 
        let records = JSON.parse(localStorage.getItem('custRecords')) || [];
        window.onload = renderHistory;

        function saveRecord() {
            const name = document.getElementById('name').value;
            const date = document.getElementById('date').value;

            if(!name || !date) { alert("Name and Date are required!"); return; }

            const data = {
                id: Date.now(),
                name: name,
                date: date,
                cycle: document.getElementById('cycle').value,
                amount: document.getElementById('amount').value,
                prod: document.getElementById('prod').value,
                details: document.getElementById('details').value
            };

            let next = new Date(data.date);
            next.setDate(next.getDate() + parseInt(data.cycle));
            data.nextDateStr = next.toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });

            records.push(data);
            localStorage.setItem('custRecords', JSON.stringify(records));
            renderHistory();
            showInAnotherDisplay(data);
        }

        function renderHistory() {
            const list = document.getElementById('history-list');
            list.innerHTML = ""; 
            records.slice().reverse().forEach(r => {
                const div = document.createElement('div');
                div.className = 'item';
                div.innerHTML = `
                    <div onclick="showInAnotherDisplayById(${r.id})" style="flex-grow:1">
                        <b>${r.name}</b> <br>
                        <small style="color:var(--pink)">Next: ${r.nextDateStr}</small>
                    </div>
                    <span class="del-icon" onclick="deleteRecord(event, ${r.id})">×</span>
                `;
                list.appendChild(div);
            });
        }

        function deleteRecord(event, id) {
            event.stopPropagation();
            if(confirm("Delete this record?")) {
                records = records.filter(item => item.id !== id);
                localStorage.setItem('custRecords', JSON.stringify(records));
                renderHistory();
            }
        }

        function showInAnotherDisplay(r) {
            document.getElementById('display-content').innerHTML = `
                <p><b>Customer:</b> ${r.name}</p>
                <p><b>Product:</b> ${r.prod}</p>
                <p><b>Details:</b> ${r.details}</p>
                <p><b>Amount:</b> ${r.amount || '0.00'}</p>
                <p style="color:var(--pink); border-top: 1px solid #eee; padding-top:10px;"><b>Next Date:</b> ${r.nextDateStr}</p>
            `;
            document.getElementById('details-display').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

        function showInAnotherDisplayById(id) {
            const r = records.find(r => r.id === id);
            if(r) showInAnotherDisplay(r);
        }

        function closeDisplay() {
            document.getElementById('details-display').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }
   
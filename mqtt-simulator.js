class MQTTSimulator {
    constructor() {
        this.isConnected = false;
        // this.subscribers = [];
        this.messages = [];
        this.topic = [];

        // DOM Elements
        this.connectionBtn = document.getElementById('connectionToggle');
        this.topicInput = document.getElementById('topic');
        this.messageInput = document.getElementById('message');
        this.publishBtn = document.getElementById('publish');
        this.addSubscriberBtn = document.getElementById('addSubscriber');
        // this.subscriberList = document.getElementById('subscriberList');
        this.messageLog = document.getElementById('messageLog');
        this.messageDetails = document.getElementById('messageDetails');
        this.asciiValues = document.getElementById('asciiValues');
        this.binaryValues = document.getElementById('binaryValues');

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.connectionBtn.addEventListener('click', () => this.toggleConnection());
        this.publishBtn.addEventListener('click', () => this.publishMessage());
        // this.addSubscriberBtn.addEventListener('click', () => this.addSubscriber());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.publishMessage();
        });
    }

    // Fungsi untuk mengkonversi string ke ASCII
    stringToAscii(str) {
        return str.split('').map(char => {
            const ascii = char.charCodeAt(0);
            return {
                char: char,
                ascii: ascii
            };
        });
    }

    // Fungsi untuk mengkonversi ASCII ke binary
    asciiToBinary(ascii) {
        return ascii.toString(2).padStart(8, '0');
    }

    // Fungsi untuk menampilkan data dalam format ASCII dan binary
    displayMessageDetails(message) {
        const asciiData = this.stringToAscii(message);
        
        // Menampilkan ASCII values
        this.asciiValues.innerHTML = asciiData.map(data => 
            `<span class="data-group">
                '${data.char}' = 
                <span class="ascii-value">${data.ascii}</span>
            </span>`
        ).join(' ');

        // Menampilkan Binary values
        this.binaryValues.innerHTML = asciiData.map(data =>
            `<span class="data-group">
                '${data.char}' = 
                <span class="binary-value">${this.asciiToBinary(data.ascii)}</span>
            </span>`
        ).join(' ');

        // Menampilkan message details
        this.messageDetails.classList.add('show');
    }

    publishMessage() {
        if (!this.isConnected) {
            this.addMessage('error brow', 'konek dulu');
            return;
        }

        const message = this.messageInput.value.trim();
        if (!message) return;

        // Menampilkan ASCII dan binary data
        this.displayMessageDetails(message);

        this.addMessage('publish', message);

        // Simulate message received by subscribers
        this.subscribers.forEach((sub) => {
            setTimeout(() => {
                this.addMessage('receive', message);
            }, Math.random() * 500);
        });

        this.messageInput.value = '';
    }

    addMessage(type, content) {
        const timestamp = new Date().toLocaleTimeString();
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        let messageContent = `
            <span class="timestamp">[${timestamp}]</span>
            <strong>${type.toUpperCase()}</strong> - ${content}
            <div class="topic">Topic: ${this.topicInput.value}</div>
        `;

        // Tambahkan ASCII dan binary data untuk pesan yang dipublish
        if (type === 'publish') {
            const asciiData = this.stringToAscii(content);
            const binaryData = asciiData.map(data => this.asciiToBinary(data.ascii));
            
            messageContent += `
                <div class="message-data">
                    <small>ASCII: ${asciiData.map(d => d.ascii).join(', ')}</small>
                    <br>
                    <small>Binary: ${binaryData.join(' ')}</small>
                </div>
            `;
        }

        messageDiv.innerHTML = messageContent;
        this.messageLog.appendChild(messageDiv);
        this.messageLog.scrollTop = this.messageLog.scrollHeight;
    }

    toggleConnection() {
        this.isConnected = !this.isConnected;
        this.connectionBtn.textContent = this.isConnected ? 'konek' : 'Rakonek';
        this.connectionBtn.className = `connection-status ${this.isConnected ? 'connected' : 'disconnected'}`;

        if (this.isConnected) {
            this.addMessage('system', 'Connected to MQTT broker');
        } else {
            this.addMessage('system', 'Disconnected from MQTT broker');
            this.subscribers = [];
            this.updateSubscribersList();
            this.messageDetails.classList.remove('show');
        }
    }

    addSubscriber() {
        if (!this.isConnected) {
            this.addMessage('error', 'Cannot add subscriber: Not connected to broker');
            return;
        }

        const topic = this.topicInput.value.trim();
        if (!topic) return;

        this.subscribers.push({
            id: Date.now(),
            topic: topic
        });

        this.updateSubscribersList();
        this.addMessage('system', `New subscriber added to topic: ${topic}`);
    }

    updateSubscribersList() {
        this.subscriberList.innerHTML = this.subscribers
            .map((sub, index) => `
                <div>Subscriber ${index + 1} - Topic: ${sub.topic}</div>
            `)
            .join('');
    }
}

// Initialize the simulator when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const simulator = new MQTTSimulator();
});
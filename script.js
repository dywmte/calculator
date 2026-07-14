class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.querySelectorAll('.btn.number').forEach(btn => {
            btn.addEventListener('click', () => this.handleNumber(btn.dataset.number));
        });

        document.querySelectorAll('.btn.operator').forEach(btn => {
            const action = btn.dataset.action;
            if (action === 'operator') {
                btn.addEventListener('click', () => this.handleOperator(btn.dataset.operator));
            } else if (action === 'backspace') {
                btn.addEventListener('click', () => this.handleBackspace());
            }
        });

        document.querySelector('.btn.clear').addEventListener('click', () => this.handleClear());
        document.querySelector('.btn.equals').addEventListener('click', () => this.handleEquals());

        // Keyboard support
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleNumber(number) {
        if (this.shouldResetDisplay) {
            this.currentValue = number;
            this.shouldResetDisplay = false;
        } else {
            this.currentValue = this.currentValue === '0' ? number : this.currentValue + number;
        }
        this.updateDisplay();
    }

    handleOperator(op) {
        if (this.operation !== null && !this.shouldResetDisplay) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operation = op;
        this.shouldResetDisplay = true;
    }

    handleEquals() {
        if (this.operation === null || this.shouldResetDisplay) {
            return;
        }
        this.calculate();
    }

    calculate() {
        let result;
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);

        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current !== 0 ? prev / current : 0;
                break;
            case '.':
                return;
            default:
                return;
        }

        this.currentValue = result.toString();
        this.operation = null;
        this.shouldResetDisplay = true;
        this.updateDisplay();
    }

    handleBackspace() {
        if (this.shouldResetDisplay) return;
        this.currentValue = this.currentValue.slice(0, -1) || '0';
        this.updateDisplay();
    }

    handleClear() {
        this.currentValue = '0';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.handleNumber(e.key);
        if (e.key === '.') this.handleOperator('.');
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            e.preventDefault();
            this.handleOperator(e.key);
        }
        if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            this.handleEquals();
        }
        if (e.key === 'Backspace') {
            e.preventDefault();
            this.handleBackspace();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            this.handleClear();
        }
    }

    updateDisplay() {
        this.display.value = this.currentValue;
    }
}

// Initialize calculator when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
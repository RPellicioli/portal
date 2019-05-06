import { FormControl, Validators } from "@angular/forms";

export class FormsValidators {
    public static getPasswordStrength(password: string): number {
        let strength = 0;
        if (password.length >= 6) {
            let rules = 0;
            if (password.length >= 6 && password.length < 13) {
                strength += 5;
            }
            if (password.match(/[a-z]+/)) {
                rules++;
                strength += 10;
            }
            if (password.match(/[A-Z]+/)) {
                rules++;
                strength += 10;
            }
            if (password.match(/[0-9]+/)) {
                rules++;
                strength += 10;
            }
            if (password.match(/[\W]+/)) {
                rules++;
                strength += 10;
            }
            if (rules > 2 && password.length >= 13) {
                strength += 10;
            }
        }
        return (strength / 10.0);
    }

    public static emailNotRequiredValidator(input: FormControl) {
        if (!input.value) {
            return null;
        }
        return Validators.email(input);
    }

    public static passwordTooWeak(input: FormControl) {
        if (input.value) {
            const strength = FormsValidators.getPasswordStrength(input.value);
            return strength <= 2 ? { weakPassword: true } : null;
        }
        return null;
    }

    public static passwordExactMatch(input: FormControl) {
        if (!input.parent) {
            return null;
        }
        const currentPassword = input.parent.controls['password'].value;
        if (currentPassword && !input.value) {
            return { mismatchedPassword: true };
        }
        const exactMatch = currentPassword === input.value;
        return exactMatch ? null : { mismatchedPassword: true };
    }

    public static validateCPF(cpfControl: FormControl) {
        const cpf = cpfControl.value;
        const invalidCPF = { invalidCPF: true };
        if (!cpf || typeof cpf !== 'string' || cpf.length <= 9) {
            return invalidCPF;
        }

        let sum = 0;
        let rest = 0;

        if (cpf === '00000000000') {
            return invalidCPF;
        }
        for (let i = 1; i <= 9; i++) {
            sum = (sum + parseInt(cpf.substring(i - 1, i)) * (11 - i));
        }

        rest = ((sum * 10) % 11);

        if ((rest === 10) || (rest === 11)) {
            rest = 0;
        }
        if (rest !== parseInt(cpf.substring(9, 10))) {
            return invalidCPF;
        }

        sum = 0;
        for (let i = 1; i <= 10; i++) {
            sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
        }
        rest = ((sum * 10) % 11);

        if ((rest === 10) || (rest === 11)) {
            rest = 0;
        }
        if (rest != parseInt(cpf.substring(10, 11))) {
            return invalidCPF;
        }

        return null;
    }

    public static validateCNPJ(cnpjControl: FormControl) {
        let cnpj = cnpjControl.value;
        const invalidCNPJ = { invalidCNPJ: true };

        if (!cnpj || typeof cnpj !== 'string' || cnpj.length <= 9) {
            return invalidCNPJ;
        }

        const invalidCNPJs: Array<string> = [
            '00000000000000', '11111111111111', '22222222222222', '33333333333333', '44444444444444',
            '55555555555555', '66666666666666', '77777777777777', '88888888888888', '99999999999999'
        ];

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj.length != 14 || invalidCNPJs.indexOf(cnpj) != -1) {
            return invalidCNPJ;
        }

        let length: number = (cnpj.length - 2);
        let numbers: string = cnpj.substring(0, length);
        let digits: string = cnpj.substring(length);
        let sum: number = 0;
        let after: number = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += (parseInt(numbers.charAt(length - i)) * after--);
            if (after < 2) {
                after = 9;
            }
        }

        let result = (sum % 11 < 2 ? 0 : 11 - sum % 11);
        if (result !== parseInt(digits.charAt(0))) {
            return invalidCNPJ;
        }

        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        after = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += (parseInt(numbers.charAt(length - i)) * after--);
            if (after < 2) {
                after = 9;
            }
        }
        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result != parseInt(digits.charAt(1))) {
            return invalidCNPJ;
        }

        return null;
    }
}
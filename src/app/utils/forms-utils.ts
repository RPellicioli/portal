import { FormGroup, AbstractControl } from "@angular/forms";

export class FormsUtils {
    public static autoFillForm(form: FormGroup, data: any): void {
        for (let key of Object.keys(form.controls)) {
            try {
                form.controls[key].setValue(FormsUtils.getDataValue(data, key));
            } catch (e) {
                continue;
            }
        }
    }

    public static touchFormControls(form: FormGroup): void {
        if (form && form.controls) {
            for (let key of Object.keys(form.controls)) {
                try {
                    form.controls[key].markAsTouched();
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    public static formToModel<T>(form: FormGroup, type: { new(): T; }): T {
        const model: T = new type();
        if (form && form.controls && type) {
            for (let key of Object.keys(form.controls)) {
                try {
                    FormsUtils.setDataValue(model, key, form.controls[key].value);
                } catch (e) {
                    console.log(e);
                }
            }
        }
        return model;
    }

    public static inputHasError(form: FormGroup, formControlName: string, validationAttrs?: Array<string>): boolean {
        if (!form || !form.controls) {
            return false;
        }
        
        let hasCustomError = false;
        const control: AbstractControl = form.controls[formControlName];
        if (validationAttrs) {
            for (let i = 0; i < validationAttrs.length; i++) {
                if (control.hasError(validationAttrs[i])) {
                    hasCustomError = true;
                    break;
                }
            }
        }
        return (control.touched && (control.invalid || hasCustomError));
    }

    public static hasValue(form: FormGroup, formControlName: string): boolean {
        if (!form || !form.controls) {
            return false;
        }

        const control: AbstractControl = form.controls[formControlName];
              
        return control.value != undefined && control.value != "";
    }

    private static setDataValue(dataObj: any, key: string, value: any) {
        let paths = key.split(".");

        if (paths.length > 1) {
            key = paths[0];

            if (!dataObj[key]) {
                dataObj[key] = { };
            }

            paths.splice(0, 1);

            FormsUtils.setDataValue(dataObj[key], paths.join("."), value);
        }
        else {
            dataObj[key] = value;
        }
    }

    private static getDataValue(dataObj: any, key: string): any {
        if (!dataObj) {
            return undefined;
        }

        let paths = key.split(".");

        if (paths.length > 1) {
            key = paths[0];

            if (!dataObj[key]) {
                return dataObj[key];
            }

            paths.splice(0, 1);

            return FormsUtils.getDataValue(dataObj[key], paths.join("."));
        }
        else {
            return dataObj[key];
        }
    }
}
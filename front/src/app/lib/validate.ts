import { IloginErrors, IloginProps, IRegisterErrors, IRegisterProps } from "@/types";

export function validateLoginForm (values: IloginProps) {
         const errors: IloginErrors = {};
         if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
         return errors;
       }

export function validateRegisterForm (values: IRegisterProps) {
                const errors: IRegisterErrors = {};
                if (!values.email) {
                  errors.email = 'Required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }
              
                if (!values.password) {
                  errors.password = 'Required';
                } else if (values.password.length < 6) {
                  errors.password = 'Password must be at least 6 characters long';
                }

                if (!values.name) {
                  errors.name = 'Name is required';
                } else if (values.name.length < 3) {
                  errors.name = 'Name must be at least 3 characters long';
                }
              
              
                if (!values.address) {
                  errors.address = 'Required';
                } else if (values.address.length < 10) {
                  errors.address = 'Address must be at least 10 characters long';
                }
              
                if (!values.phone) {
                  errors.phone = 'Required';
                } else if (!/^[0-9]{10}$/.test(values.phone)) {
                  errors.phone = 'Phone must be exactly 10 digits';
                }
              
                return errors;
              }
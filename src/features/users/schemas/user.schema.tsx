import * as Yup from 'yup';

export const UserSchema = Yup.object().shape({
  email: Yup.string().email('Email invalide').required('Email requis'),
  first_name: Yup.string().required('Prénom requis'),
  last_name: Yup.string().required('Nom requis'),
  role: Yup.string(),
});

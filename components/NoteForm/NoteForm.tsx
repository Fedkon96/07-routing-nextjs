import css from './NoteForm.module.css';
import { Field, Form, Formik, ErrorMessage, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '../../lib/api';
import { TfiArrowCircleDown } from 'react-icons/tfi';
import { Tag } from '@/types/note';

interface FormValues {
  title: string;
  content: string;
  tag: Tag;
}

interface NoteFormProps {
  onClose: () => void;
}

// !valid
const ValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title must have min 3 characters')
    .max(50, 'Title must have max 50 characters')
    .required('Required'),
  content: Yup.string().max(500, 'Description must have max 500 characters'),
  tag: Yup.string()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Required'),
});
// !!!
const NoteForm = ({ onClose }: NoteFormProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });
  const handleSubmit = (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    console.log(values);
    mutation.mutate(values);
    actions.resetForm();
  };
  return (
    <Formik
      validationSchema={ValidationSchema}
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">
            Title
            <Field id="title" type="text" name="title" className={css.input} />
          </label>
          <ErrorMessage name="title" className={css.error} component="span" />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">
            Content
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
            />
          </label>
          <ErrorMessage name="content" className={css.error} component="span" />
        </div>

        <div className={css.formGroup}>
          <label className={css.arrowFather} htmlFor="tag">
            Tag
            <TfiArrowCircleDown className={css.arrow} />
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
          </label>
          <ErrorMessage name="tag" className={css.error} component="span" />
        </div>

        <div className={css.actions}>
          <button onClick={onClose} type="button" className={css.cancelButton}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
};

export default NoteForm;

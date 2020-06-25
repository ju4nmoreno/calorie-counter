import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  showFormMsg,
  mealInputMsg,
  caloriesInputMsg,
  saveMealMsg,
  deleteMealMsg,
  editMealMsg,
} from './Update';

const {
  pre,
  div,
  h1,
  button,
  form,
  label,
  input,
  table,
  tr,
  td,
  thead,
  tbody,
  i,
} = hh(h);

function buttonsSet(dispatch) {
  return div([
    button(
      { className: 'f3 pv2 ph3 bg-blue white bn mr2 dim', type: 'submit' },
      'Save'
    ),
    button(
      {
        className: 'f3 pv2 ph3 bn bg-light-gray dim',
        type: 'button',
        onclick: () => dispatch(showFormMsg(false)),
      },
      'Cancel'
    ),
  ]);
}

function fieldSet(labelText, inputValue, oninput) {
  return div([
    label({ className: 'db mb1' }, labelText),
    input({
      className: 'pa2 input-reset ba w-100 mb2',
      type: 'text',
      value: inputValue,
      oninput,
    }),
  ]);
}

function formView(dispatch, model) {
  const { description, calories, showForm } = model;

  if (showForm) {
    return form(
      {
        className: 'w-100 mv2',
        onsubmit: (e) => {
          e.preventDefault();
          dispatch(saveMealMsg);
        },
      },
      [
        fieldSet('Meal', description, (e) =>
          dispatch(mealInputMsg(e.target.value))
        ),
        fieldSet('Calories', calories || '', (e) =>
          dispatch(caloriesInputMsg(e.target.value))
        ),
        buttonsSet(dispatch),
      ]
    );
  }
  return button(
    {
      className: 'f3 pv2 ph3 bg-blue white bn',
      onclick: () => dispatch(showFormMsg(true)),
    },
    'Add Meal'
  );
}

const reducerMealsCalories = (acc, curr) => acc + curr.calories;

const cell = (className, value) => td({ className }, value);

function mealRow(dispatch, meal) {
  const { description, calories, id } = meal;
  return tr({ className: 'lh-copy stripe-dark' }, [
    cell('pa3', description),
    cell('pa3', calories),
    cell('pa3', [
      i({
        className: 'ph1 fa fa-trash-o pointer',
        onclick: () => dispatch(deleteMealMsg(id)),
      }),
      i({
        className: 'ph1 fa fa-pencil-square-o pointer',
        onclick: () => dispatch(editMealMsg(id)),
      }),
    ]),
  ]);
}

function bodyMeals(dispatch, meals) {
  return meals.map((meal) => mealRow(dispatch, meal));
}

const tableHead = thead({ className: 'lh-copy' }, [
  tr({ className: 'bg-mid-gray white' }, [
    cell('pa3', 'Meal'),
    cell('pa3', 'Calories'),
    cell(),
  ]),
]);

const tableFooter = (meals) =>
  tr({ className: 'stripe-dark' }, [
    cell('pa3 b bg-light-yellow', 'Total'),
    cell('pa3 bg-light-yellow', meals.reduce(reducerMealsCalories, 0)),
    cell('pa3 bg-yellow', ''),
  ]);

function tableView(dispatch, model) {
  const { meals } = model;
  if (meals.length) {
    return div({ className: 'overflow-auto' }, [
      table({ className: 'w-100 center ba mt3', cellspacing: 0 }, [
        tableHead,
        tbody([bodyMeals(dispatch, meals), tableFooter(meals)]),
      ]),
    ]);
  } else {
    return div({ className: 'mv2 i back-50' }, 'No meals to display...');
  }
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Calorie Counter'),
    formView(dispatch, model),
    tableView(dispatch, model),
    // pre(JSON.stringify(model, null, 2)),
  ]);
}

export default view;

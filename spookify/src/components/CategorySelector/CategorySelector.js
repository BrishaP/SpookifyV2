import React from 'react';
import Checkbox from '../Checkbox/Checkbox'; // Import the Checkbox component


const CategorySelector = ({ category, handleCheckboxChange }) => (
  <>
    <Checkbox
      name="DIY"
      checked={category.DIY}
      onChange={handleCheckboxChange}
      label="DIY"
    />
    <Checkbox
      name="FOOD"
      checked={category.FOOD}
      onChange={handleCheckboxChange}
      label="FOOD"
    />
    <Checkbox
      name="PARTY"
      checked={category.PARTY}
      onChange={handleCheckboxChange}
      label="PARTY"
    />
  </>
);

export default CategorySelector;
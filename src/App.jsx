/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    oneCategory => product.categoryId === oneCategory.id,
  );
  const user = usersFromServer.find(oneUser => category.ownerId === oneUser.id);

  return {
    ...product,
    category,
    user,
  };
});

const filterProducts = (
  rawProducts,
  userFilter,
  categoryFilter,
  searchFilter,
) => {
  const filteredProducts = rawProducts.filter((product) => {
    const userMatch = userFilter === 'All'
    || product.user.name === userFilter;
    const categoryMatch = categoryFilter.length === 0
    || categoryFilter.includes(product.category);

    const preparedProductName = product.name.toLowerCase();
    const preparedSearch = searchFilter.toLowerCase();

    const searchMatch = preparedProductName.includes(preparedSearch);

    return userMatch && searchMatch && categoryMatch;
  });

  return filteredProducts;
};

export const App = () => {
  const [selectedUser, setSelectedUser] = useState('All');
  const [searchValue, setSearchValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState('');

  const handleUserFilter = (user) => {
    setSelectedUser(user.name || 'All');
  };

  const handleCategoryFilter = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleResetFilters = () => {
    setSelectedUser('All');
    setSearchValue('');
  };

  const handleResetCategories = () => {
    setSelectedCategories([]);
  };

  const filteredProducts = filterProducts(
    products,
    selectedUser,
    selectedCategories,
    searchValue,
  );
  const showNoResults = filteredProducts.length === 0;

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => handleUserFilter('All')}
                className={cn({ 'is-active': selectedUser === 'All' })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn({ 'is-active': selectedUser === user.name })}
                  onClick={() => handleUserFilter(user)}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchValue}
                  onChange={event => setSearchValue(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {searchValue !== ''
                  && (
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                    onClick={() => setSearchValue('')}
                  />
                  )
                  }
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6',
                  { 'is-outlined': selectedCategories.length > 0 })}
                onClick={handleResetCategories}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategories.includes(category),
                  })}
                  href="#/"
                  onClick={() => handleCategoryFilter(category)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetFilters}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {showNoResults ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User

                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({ 'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f' })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
          }
        </div>
      </div>
    </div>
  );
};

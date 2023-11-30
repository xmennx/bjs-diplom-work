const logoutButton = new LogoutButton();

logoutButton.action = function() {
    ApiConnector.logout(response => {
      if (response.success) {
        location.reload();
      } else {
        console.error('Ошибка при выходе из системы');
      }
    });
  };

  ApiConnector.current(response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
    } else {
      console.error('Ошибка получения данных о пользователе');
    }
  });

  const ratesBoard = new RatesBoard();

  function getCurrencyRates() {
    ApiConnector.getStocks(response => {
      if (response.success) {
        ratesBoard.clearTable();
        ratesBoard.fillTable(response.data);
      } else {
        console.error('Ошибка получения курсов валют');
      }
    });
  }

  getCurrencyRates();
  setInterval(getCurrencyRates, 60000);

  const moneyManager = new MoneyManager();

  moneyManager.addMoneyCallback = function(data) {
    ApiConnector.addMoney(data, response => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, 'Баланс успешно пополнен');
      } else {
        moneyManager.setMessage(false, response.error || 'Ошибка пополнения баланса');
      }
    });
  };
  
  moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, response => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, 'Конвертация валюты выполнена успешно');
      } else {
        moneyManager.setMessage(false, response.error || 'Ошибка конвертации валюты');
      }
    });
  };

  moneyManager.sendMoneyCallback = function(data) {
    ApiConnector.transferMoney(data, response => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(true, 'Перевод валюты выполнен успешно');
      } else {
        moneyManager.setMessage(false, response.error || 'Ошибка при переводе валюты');
      }
    });
  };
  
  const favoritesWidget = new FavoritesWidget();

  ApiConnector.getFavorites(response => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
    } else {
      console.error('Ошибка получения списка избранного');
    }
  });
  
  favoritesWidget.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, response => {
      if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(true, 'Пользователь добавлен в избранное');
      } else {
        favoritesWidget.setMessage(false, response.error || 'Ошибка добавления пользователя в избранное');
      }
    });
  };
  
  favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, response => {
      if (response.success) {
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
        favoritesWidget.setMessage(true, 'Пользователь удален из избранного');
      } else {
        favoritesWidget.setMessage(false, response.error || 'Ошибка удаления пользователя из избранного');
      }
    });
  };
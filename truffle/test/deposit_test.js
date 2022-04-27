const Deposit = artifacts.require('./Deposit.sol');
const Vimpto = artifacts.require('./Vimpto');
require('dotenv').config();
const Hard_Wallet_Address_1 = '0x50f28d95243661C98F57664041564aE6F6E69d4b';
const Hard_Wallet_Address_2 = '0xa4Fe2a295F5614f7A96A3Bbd97Bba03b4614eE23';
const Hard_Wallet_Address_3 = '0x5D833fc85d404713040Bf2DBaE616FCCb3da2b87';
// const ethers = require('ethers');
// const utils = require('./utils');
// const time = require('./time');
contract('Deposit', (accounts) => {
  // fetch accounts on different index
  let [alice, bob, Usman, Imaad] = accounts;
  let DepositContract;
  let vim;
  /**
   * Before every test cases we are depolying
   * VIM and Deposit contract.
   */
  beforeEach(async () => {
    vim = await Vimpto.new();
    DepositContract = await Deposit.new(vim.address);
  });

  it('Transfer 10 VIM Token to BOB from Alice', async () => {
    console.log(`
              Transfer 10 VIM Token to BOB from Alice
                    `);
    await vim.transfer(bob, web3.utils.toWei('10', 'ether'), { from: alice });
    var aliceBlance = await vim.balanceOf(alice);
    var bobBlance = await vim.balanceOf(bob);
    console.log(`
              AliceBlance-->${web3.utils.fromWei(aliceBlance.toString())}   
              BobBlance--> ${web3.utils.fromWei(bobBlance.toString())}
                    `);
  });
  /**
   *
   * @param {address of depositer} fromAddress
   *
   * To deposit we have to take Approval from that token,
   * then only we are bale to deposit ERC20 in deposit contract.
   */
  async function depositErc20(fromAddress) {
    const allowanceBefore = await vim.allowance(
      fromAddress,
      DepositContract.address,
      {
        from: fromAddress,
      }
    );
    console.log(
      'Amount of Vim deposit is allowed to transfer on our behalf Before: ' +
        allowanceBefore.toString()
    );
    await vim.approve(
      DepositContract.address,
      web3.utils.toWei('100', 'ether'),
      {
        from: fromAddress,
      }
    );

    const allowanceAfter = await vim.allowance(
      fromAddress,
      DepositContract.address,
      {
        from: fromAddress,
      }
    );
    console.log(
      'Amount of Vim is allowed to transfer on our behalf After: ' +
        web3.utils.fromWei(allowanceAfter.toString())
    );

    balanceMyTokenBeforeAccounts0 = await vim.balanceOf(fromAddress);
    console.log('*** Vim Token ***');
    console.log(
      `Balance Vim Before ${fromAddress}  
        ${web3.utils.fromWei(balanceMyTokenBeforeAccounts0.toString())}`
    );

    console.log('Call Deposit Function');
    await DepositContract.deposit(web3.utils.toWei('100', 'ether'), {
      from: fromAddress,
    });

    let bal = await DepositContract.balance();
    console.log(`
                 Contract Balance:- ${web3.utils.fromWei(bal.toString())}
                  `);

    let newBal = await DepositContract.getBalances(fromAddress, {
      from: alice,
    });
    console.log(
      `${fromAddress} Balance in Smart Contract After Deposit:-,
      ${web3.utils.fromWei(newBal.toString())}`
    );
  }

  it('Deposit VIM token into Smart Contract from different account', async () => {
    await deposit();
  });

  async function deposit() {
    await depositErc20(alice);
    //transfer VIM to bob
    await vim.transfer(bob, web3.utils.toWei('100', 'ether'), { from: alice });
    //deposit VIM into smart contract
    await depositErc20(bob);
    //transfer VIM to Usman
    await vim.transfer(Usman, web3.utils.toWei('100', 'ether'), {
      from: alice,
    });
    //deposit VIM into smart contract
    await depositErc20(Usman);
    //transfer VIM to Imaad
    await vim.transfer(Imaad, web3.utils.toWei('100', 'ether'), {
      from: alice,
    });
    //deposit VIM into smart contract
    await depositErc20(Imaad);
  }
  async function checkBalance(address) {
    let bal = await DepositContract.getBalances(address, {
      from: alice,
    });
    bal;
    return bal;
  }
  it('Withdraw VIM token from Smart Contract by Owner into requester account', async () => {
    // deposit some amount od VIM in diffent account
    await deposit();
    //check balnce before Withdraw
    let bal = await checkBalance(bob);
    console.log(`
      check bob balnce before Withdraw in smart contract:${web3.utils.fromWei(
        bal.toString()
      )}
      `);
    let vimBefore = await vim.balanceOf(bob);
    console.log(`
      check bob VIM balnce in bob account:${web3.utils.fromWei(
        vimBefore.toString()
      )}
      `);
    await DepositContract.withdraw(bob, bal);
    //check balnce after Withdraw
    let afterBal = await checkBalance(bob);
    console.log(`
      check bob balnce after Withdraw in smart contract:${web3.utils.fromWei(
        afterBal.toString()
      )}
      `);
    let vimAfter = await vim.balanceOf(bob);
    console.log(`                    
      check bob VIM balnce in bob account:${web3.utils.fromWei(
        vimAfter.toString()
      )}
      `);
  });

  it('Add HardWallet address in contract.', async () => {
    await DepositContract.addHardWallet(Hard_Wallet_Address_1);
    let wallet1 = await DepositContract.hardWallet(0);
    console.log(`                    
      ${wallet1}:-Wallet 1 push while depolyment of contract.

      Note:-
         -Dublicate address can't be stored.
         -OnlyOwner can call this function.
      `);
  });

  it('Delete HardWallet address from contract.', async () => {
    console.log(`
                Adding two HardWallet.
                  `);
    await DepositContract.addHardWallet(Hard_Wallet_Address_1);
    await DepositContract.addHardWallet(Hard_Wallet_Address_2);
    let wallet1 = await DepositContract.hardWallet(0);
    let wallet2 = await DepositContract.hardWallet(1);
    console.log(`
      ${wallet1}:-Wallet 1
      ${wallet2}:-Wallet 2
      `);
    console.log(`
               Deleting One HardWallet.
                   `);
    await DepositContract.deleteHardWallet(Hard_Wallet_Address_1);
    wallet1 = await DepositContract.hardWallet(0);
    console.log(`
       ${wallet1}:-Wallet 1
      `);
    console.log(`
                Adding one more HardWallet.
                    `);
    await DepositContract.addHardWallet(Hard_Wallet_Address_3);
    wallet1 = await DepositContract.hardWallet(0);
    wallet2 = await DepositContract.hardWallet(1);
    console.log(`
        ${wallet1}:-Wallet 1
        ${wallet2}:-Wallet 2
       `);
  });

  it('Swip-Out all deposited ERC20 to HardWallets.', async () => {
    await deposit();
    let bal_1 = await DepositContract.balance();
    console.log(`
                   Contract Balance:- ${web3.utils.fromWei(bal_1.toString())}
                    `);
    await DepositContract.addHardWallet(Hard_Wallet_Address_1);
    await DepositContract.swipOutToHardWallet();
    var wallet_1_Bal = await vim.balanceOf(Hard_Wallet_Address_1);
    //let wallet_1_Bal = await checkBalance(Hard_Wallet_Address_1);
    console.log(`
                  HardWallet Balance after swip-out:-${web3.utils.fromWei(
                    wallet_1_Bal.toString()
                  )}
      `);
    let bal_2 = await DepositContract.balance();
    console.log(`
                   Contract Balanceafter swip-out:- ${web3.utils.fromWei(
                     bal_2.toString()
                   )}
                    `);
  });
});

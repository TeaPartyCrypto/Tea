package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	nkn "github.com/nknorg/nkn-sdk-go"

	"go.uber.org/zap"

	controller "github.com/TeaParty/Tea/packages/backend/pkg"
)

type Account struct {
	PrivateKey  string `json:"PrivateKey"`
	PublicKey   string `json:"PublicKey"`
	ProgramHash string `json:"ProgramHash"`
}

func main() {
	c := &controller.Controller{}
	// look for a local NKN wallet
	// if one is not found, create one
	// and save it to the local file system
	// for future use.

	f := "data/wallet"
	_, err := os.Stat(f)
	if os.IsNotExist(err) {
		// create a new account
		account, err := nkn.NewAccount(nil)
		if err != nil {
			log.Fatal(err)
			return
		}

		wallet, err := nkn.NewWallet(account, &nkn.WalletConfig{Password: "password"})
		if err != nil {
			log.Fatal(err)
			return
		}

		ajson, err := json.Marshal(wallet)
		if err != nil {
			log.Fatal(err)
			return
		}

		// save the account to the file system
		os.WriteFile(f, ajson, 0644)
	}

	// load the wallet from the file system
	walletBytes, err := os.ReadFile(f)
	if err != nil {
		log.Fatal(err)
		return
	}

	walletFromJSON, err := nkn.WalletFromJSON(string(walletBytes), &nkn.WalletConfig{Password: "password"})
	if err != nil {
		log.Fatal(err)
		return
	}

	account, err := nkn.NewAccount(walletFromJSON.Seed())
	if err != nil {
		log.Fatal(err)
		return
	}

	toClient, err := nkn.NewMultiClient(account, "", 4, false, nil)
	if err != nil {
		log.Fatal(err)
		return
	}

	c.NKNClient = toClient
	c.SAASAddress = os.Getenv("SAAS_ADDRESS")

	if c.SAASAddress == "" {
		c.SAASAddress = "http://104.37.251.139:8080"
	}

	// create a new sugard logger
	c.Log, err = zap.NewProduction()
	if err != nil {
		log.Fatal(err)
		return
	}

	go c.StartNKNConnection()

	http.HandleFunc("/", c.RootHandler)
	http.HandleFunc("/sell", c.Sell)
	http.HandleFunc("/list", c.ListOrders)
	http.HandleFunc("/buy", c.Buy)
	http.HandleFunc("/getNKNAddress", c.GetNKNAddress)
	http.HandleFunc("/getPrivateKeys", c.GetPrivateKeys)
	http.HandleFunc("/deletePK", c.DeletePrivateKey)
	// http.HandleFunc("/fetchopenorderbynkn", c.FetchOpenOrderByNKN)
	http.HandleFunc("/ws", c.SocketHandler)
	log.Println("Listening on :8081")
	http.ListenAndServe(":8081", nil)

}

package controller

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path"
	"strings"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

var once sync.Once

func (c *Controller) RootHandler(w http.ResponseWriter, r *http.Request) {
	once.Do(func() {
		kdp := path.Join(os.Getenv("KO_DATA_PATH"))
		if !strings.HasSuffix(kdp, "/") {
			kdp = kdp + "/"
		}
		c.rootHandler = http.FileServer(http.Dir(kdp))
	})
	c.rootHandler.ServeHTTP(w, r)
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  4096,
	WriteBufferSize: 4096,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (c *Controller) SocketHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Print("Error during connection upgradation:", err)
		return
	}

	c.WSHandler(conn)
}

// Sell is a http route handler that accepts a sell order
// sell orders are stored in an on prem MongoDB database
func (c *Controller) Sell(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	fmt.Printf("Sell Order Received: %+v", r.Body)
	// parse the request body into a sell order
	sellOrder := &SellOrder{}
	err := json.NewDecoder(r.Body).Decode(sellOrder)
	if err != nil {
		// c.logger.Error("error decoding sell order: " + err.Error())
		fmt.Printf("error decoding sell order: " + err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// TODO: verify that sellOrder.Amount != nil
	// verify that all fields are not empty
	if sellOrder.Currency == "" || sellOrder.TradeAsset == "" {
		fmt.Printf("error: currency or trade asset is empty")
		json.NewEncoder(w).Encode("invalid sell order")
		return
	}

	// generate a random string to be used as the transaction ID
	sellOrder.TXID = uuid.New().String()
	// add the NKN address to the sell order
	sellOrder.SellerNKNAddress = c.NKNClient.Address()
	// prepare sellOrder to send in the http request
	sellOrderJSON, err := json.Marshal(sellOrder)
	if err != nil {
		fmt.Printf("error marshalling sell order: " + err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	io := bytes.NewBuffer(sellOrderJSON)
	req, err := http.NewRequest("POST", c.SAASAddress+"/sell", io)
	if err != nil {
		fmt.Printf("error creating http request: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error creating http request")
		return
	}

	req.Header.Set("Content-Type", "application/json; charset=UTF-8")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Printf("error sending sell order to SAAS: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error sending sell order to SAAS")
		return
	}
	defer resp.Body.Close()

	fmt.Println("response Status:", resp.Status)
	fmt.Println("response Headers:", resp.Header)
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("error reading response body: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error: something bad happend.. please check the logs")
		return
	}

	fmt.Println("response Body:", string(body))
	if resp.StatusCode != 202 {
		fmt.Printf("error: status code is not 202")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error: something bad happend.. please check the logs")
		return
	}

	// return accepted to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode("sell order accepted")
}

func (c *Controller) ListOrders(w http.ResponseWriter, r *http.Request) {
	// http get request to the SAAS to get all the orders
	resp, err := http.Get(c.SAASAddress + "/listorders")
	if err != nil {
		fmt.Printf("error: status code is not 202")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error: something bad happend.. please check the logs")
	}
	defer resp.Body.Close()
	var orders []SellOrder
	json.NewDecoder(resp.Body).Decode(&orders)
	if orders == nil {
		orders = []SellOrder{}
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(orders)
}

func (c *Controller) Buy(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	fmt.Printf("Buy Order Received: %+v", r.Body)
	// parse the request body into a buy order
	buyOrder := &BuyOrder{}
	err := json.NewDecoder(r.Body).Decode(buyOrder)
	if err != nil {
		// c.logger.Error("error decoding buy order: " + err.Error())
		fmt.Printf("error decoding buy order: " + err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	buyOrder.BuyerNKNAddress = c.NKNClient.Address()

	buyOrderJSON, err := json.Marshal(buyOrder)
	if err != nil {
		fmt.Printf("error marshalling sell order: " + err.Error())
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	io := bytes.NewBuffer(buyOrderJSON)
	req, err := http.NewRequest("POST", c.SAASAddress+"/buy", io)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	req.Header.Set("Content-Type", "application/json; charset=UTF-8")
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer resp.Body.Close()

	fmt.Println("response Status:", resp.Status)

	fmt.Printf("response body is: %+v", resp.Body)

	if resp.StatusCode != 200 {
		fmt.Printf("error: status code is not 200")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error: something bad happend.. please check the logs")
		return
	}

	// return body to the client
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode("buy order accepted")
}

func (c *Controller) StartNKNConnection() {
	log.Printf("listening on %s", c.NKNClient.Address())
	// defer c.NKNClient.Close()
	<-c.NKNClient.OnConnect.C
	for {
		select {
		case msg := <-c.NKNClient.OnMessage.C:
			isEncryptedStr := "unencrypted"
			if msg.Encrypted {
				isEncryptedStr = "encrypted"
			}
			log.Println("Receive", isEncryptedStr, "message", "\""+string(msg.Data)+"\"", "from", msg.Src)
			writeLog("Receive " + isEncryptedStr + " message " + string(msg.Data) + " from " + msg.Src)
			nknNotification := &NKNNotification{}
			err := json.Unmarshal(msg.Data, nknNotification)
			if err != nil {
				log.Println("error decoding nkn notification: " + err.Error())
				manager.send("error decoding nkn notification: " + err.Error())
				return
			}

			// check for a private key
			if nknNotification.PrivateKey != "" {
				log.Println("saving private key to file system: " + nknNotification.PrivateKey)
				// save the private key to the file system
				if err := savePKToFS(nknNotification); err != nil {
					log.Println("error saving private key to file system: " + err.Error())
					manager.send("error saving private key to file system: " + err.Error())
					return
				}
			}

			// send the notification to the client
			manager.send(string(msg.Data))
			msg.Reply([]byte("ok"))
		}
	}
}

// savePKToFS saves the private key to the file system
func savePKToFS(pk *NKNNotification) error {
	// create a new file and save the private key to it
	f, err := os.Create("data/keys/" + pk.Chain + "-" + pk.Address + ".txt")
	if err != nil {
		log.Println("error creating private key file: " + err.Error())
		return err
	}
	defer f.Close()

	bte, err := json.Marshal(pk)
	if err != nil {
		log.Println("error marshalling private key: " + err.Error())
		return err
	}

	// write the entire `pk` struct to the file
	_, err = f.Write(bte)
	if err != nil {
		log.Println("error writing private key to file: " + err.Error())
		return err
	}

	return nil
}

func writeLog(msg string) error {
	// check to see if the log.txt file exists
	if _, err := os.Stat("data/log.txt"); os.IsNotExist(err) {
		// create the file
		f, err := os.Create("data/log.txt")
		if err != nil {
			log.Println(err)
			return err
		}
		defer f.Close()
	}

	f, err := os.OpenFile("data/log.txt", os.O_APPEND|os.O_WRONLY, 0600)
	if err != nil {
		log.Println(err)
		return err
	}

	defer f.Close()
	if _, err = f.WriteString(msg + "\n"); err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func (c *Controller) GetNKNAddress(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(c.NKNClient.Address())
}

type OpenOrderRequest struct {
	NKNAddress string `json:"nknAddress"`
}

func (c *Controller) FetchOpenOrderByNKN(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	oor := &OpenOrderRequest{}
	err := json.NewDecoder(r.Body).Decode(oor)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error decoding request body: " + err.Error())
		return
	}

	oorJson, err := json.Marshal(oor)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error marshalling open order request: " + err.Error())
		return
	}

	io := bytes.NewBuffer(oorJson)
	req, err := http.NewRequest("POST", c.SAASAddress+"/fetchopenorderbynkn", io)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error creating request: " + err.Error())
		return
	}

	req.Header.Set("Content-Type", "application/json")
	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error sending request: " + err.Error())
		return
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error reading response body: " + err.Error())
		return
	}

	NKNNotification := &[]NKNNotification{}
	err = json.Unmarshal(body, NKNNotification)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error unmarshalling response body: " + err.Error())
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(NKNNotification)
}

func (c *Controller) GetPrivateKeys(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Content-Type", "application/json")

	// read the keys stored in the keys/ directory
	files, err := ioutil.ReadDir("data/keys/")
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode("error reading keys directory: " + err.Error())
		return
	}

	// create a slice to hold the private keys
	var privateKeys []NKNNotification

	// loop through the files and read the private keys
	for _, f := range files {
		// open the file
		file, err := os.Open("data/keys/" + f.Name())
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("error opening file: " + err.Error())
			return
		}

		// read the file
		bte, err := ioutil.ReadAll(file)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("error reading file: " + err.Error())
			return
		}

		// unmarshal the private key
		pk := &NKNNotification{}
		err = json.Unmarshal(bte, pk)
		if err != nil {
			log.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode("error unmarshalling private key: " + err.Error())
			return
		}

		// add the private key to the slice
		privateKeys = append(privateKeys, *pk)

		// close the file
		file.Close()
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(privateKeys)
}

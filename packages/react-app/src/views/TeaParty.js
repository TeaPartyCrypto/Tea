import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { Button, Card, Col, Container, Form, Row, Dropdown, Toast, ToastContainer } from 'react-bootstrap';
import web3 from 'web3';
import moLogo from './logo/mo.svg';
import octLogo from './logo/oct.svg';
import kasLogo from './logo/kaspa.png';
import celoLogo from './logo/celo.png';
import ethLogo from './logo/eth.png';
import btcLogo from './logo/btc.png';
import polygonLogo from './logo/matic.png';
import rxdLogo from './logo/rxd.png';
import solLogo from './logo/sol.png';
import ethOneLogo from './logo/etherone.png';
import teaPartyLogo from './logo/teaparty.png';
import burgerLogo from './logo/burgler.png';


export default function TeaParty({
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  tx,
  readContracts,
  writeContracts,
}) {
  // if address is not set, then we are not connected to the wallet
  // set a default address so that we can still interact with the contract
  if (!address) {
    address = "0x0000000000000000000000000000000000000000";
  }

  const [tradeAsset, setTradeAsset] = useState("mineonlium");
  const [amount, setAmount] = useState("1.2");
  const [currency, setCurrency] = useState("polygon");
  const [price, setPrice] = useState("1.5");
  const [txid, setTxid] = useState("");
  const [myNKNAddress, setMyNKNAddress] = useState("");
  const [sellerShippingAddress, setSellerShippingAddress] = useState("0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3");
  const [sellersPaymentTransactionID, setSellersPaymentTransactionID] = useState("");
  const [buyersPaymentTransactionID, setBuyersPaymentTransactionID] = useState("0x1232114");
  const [buyerShippingAddress, setBuyerShippingAddress] = useState("0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3");
  const [buyersRefundAddress, setBuyersRefundAddress] = useState("0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3");
  const [sellersRefundAddress, setSellersRefundAddress] = useState("0x5bbfa5724260Cb175cB39b24802A04c3bfe72eb3");
  const [userCurrentPendingPayOrders, setuserCurrentPendingPayOrders] = useState([]);
  const [pendingPayNumberAmmount, setPendingPayNumberAmmount] = useState(0);
  const [userPrivateKeys, setUserPrivateKeys] = useState([]);

  const [currentOpenOrders, setCurrentOpenOrders] = useState();
  const [sellOrderResponse, setSellOrderResponse] = useState("");
  const [buyOrderResponse, setBuyOrderResponse] = useState("");



  const [isOpen, setIsOpen] = useState(false);
  const [showPrivateKeys, setShowPrivateKeys] = useState(false);
  const [showBuyOrder, setShowBuyOrder] = useState(false);
  const [showBrowseOrders, setShowBrowseOrders] = useState(false);
  const [showPendingPayOrders, setshowPendingPayOrders] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);
  const [showNav, setShowNav] = useState(true);
  const [sortBy, setSortBy] = useState("mineonlium")

  const [waitingToReconnect, setWaitingToReconnect] = useState(null);
  const clientRef = useRef(null);

  const [events, setEvents] = useState([]);



  const URL = "ws://localhost:8081/ws";

  // take in an asset name and return the associated logo
  const returnLogo = (asset) => {
    switch (asset) {
      case "mineonlium":
        return moLogo;
      case "kaspa":
        return kasLogo;
      case "celo":
        return celoLogo;
      case "ethereum":
        return ethLogo;
      case "bitcoin":
        return btcLogo;
      case "polygon":
        return polygonLogo;
      case "radiant":
        return rxdLogo;
      case "solana":
        return solLogo;
      case "octa":
        return octLogo;
      case "ethOne":
        return ethOneLogo;
      case "burger":
        return burgerLogo;
      default:
        return teaPartyLogo;
    }
  }

  const purchaseTransaction = async () => {
    const result = tx(
      writeContracts.TeaParty.purchaseTransaction({
        value: web3.utils.toWei("1", "ether"),
      }),
      update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
          console.log(" 🍾 Transaction " + update.hash + " finished!");
          console.log(update.data);
          alert(web3.utils.hexToNumber(update.data));
          console.log(
            " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
          );
        }
      },
    );
    console.log("awaiting metamask/web3 confirm result...", result);

  }



  useEffect(() => {
    getNKNAddress();
    if (waitingToReconnect) {
      return;
    }

    listOrders();
    if (userPrivateKeys.length == 0) {
      getPKs();
    }

    // fetchOpenOrderByNKN();
    // Only set up the websocket once
    if (!clientRef.current) {
      const client = new WebSocket(URL);
      clientRef.current = client;
      window.client = client;
      client.onerror = (e) => console.error(e);
      client.onopen = () => {
        setIsOpen(true);
        console.log("ws opened");
      };

      client.onclose = () => {
        if (clientRef.current) {
          console.log("ws closed by server");
        } else {
          console.log("ws closed by app component unmount");
          return;
        }

        if (waitingToReconnect) {
          return;
        }

        setIsOpen(false);
        console.log("ws closed");

        setWaitingToReconnect(true);
        setTimeout(() => setWaitingToReconnect(null), 5000);
      };

      client.onmessage = function (e) {
        console.log("message received: ", e);
        const message = JSON.parse(e.data);
        // if the message contains an ammout property then add it to the setuserCurrentPendingPayOrders
        if (message.amount) {
          setuserCurrentPendingPayOrders((userCurrentPendingPayOrders) => [...userCurrentPendingPayOrders, message]);
          setPendingPayNumberAmmount(pendingPayNumberAmmount + 1);
        }

        // if the message contains a privateKey property then add it to the setUserPrivateKeys
        if (message.privateKey) {
          setUserPrivateKeys((userPrivateKeys) => [...userPrivateKeys, message]);
        }

        // if the message contains an error property then alert the user
        if (message.error) {
          alert(message.error);
          console.log(message.error)
        }

        setEvents((messages) => [...messages, e.data]);
      };

      return () => {
        console.log("Cleanup");
        clientRef.current = null;
        client.close();
      };
    }
  }, [waitingToReconnect]);

  // getPKs is called to fetch the locally stored private keys from the local enviorment
  const getPKs = async () => {
    axios.get('/getPrivateKeys')
      .then((response) => {
        console.log(response.data);
        setUserPrivateKeys(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      }
      );
  }

  // deletePK is called to delete a private key from the local enviorment
  const deletePK = async (address) => {
    axios.post('/deletePK', {
      address: address
    })
      .then((response) => {
        console.log(response.data);
        if (response.status == 200) {
          alert("Private Key Deleted");
          getPKs();
          return
        }
      })
      .catch((error) => {
        console.log(error);
      }
      );
  }


  // /fetchopenorderbynkn
  // const fetchOpenOrderByNKN = async () => {
  //   if (!myNKNAddress) {
  //     await getNKNAddress();
  //   }

  //   axios.post('/fetchopenorderbynkn', {
  //     nknAddress: myNKNAddress
  //   })
  //     .then((response) => {


  //       console.log(response.data);
  //       setuserCurrentPendingPayOrders(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     }
  //     );
  // }

  // /listorders is called to fetch all the open orders from Party
  const listOrders = async () => {
    axios.get('/list')
      .then((response) => {
        if (response.data) {
          setCurrentOpenOrders(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      }
      );
  }

  // getNKNAddress is called to fetch the NKN address from tea's backend
  const getNKNAddress = async () => {
    axios.get('/getNKNAddress')
      .then((response) => {
        console.log(response.data);
        setMyNKNAddress(response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
      }
      );
  }

  // /sell is called to create a new sell order
  const sell = async () => {
    // convert the amount and price into wei
    const amt = parseInt(web3.utils.toWei(amount, "ether"));
    const prc = parseInt(web3.utils.toWei(price, "ether"));

    axios.post('/sell', {
      tradeAsset: tradeAsset,
      amount: amt,
      currency: currency,
      price: prc,
      locked: false,
      sellerShippingAddress: sellerShippingAddress,
      sellerNKNAddress: myNKNAddress,
      paymentTransactionID: address,
      refundAddress: sellersRefundAddress,
    }).then((response) => {
      console.log(response.data);
      setSellOrderResponse(response.data);
      listOrders();
    });
  }

  // /buy
  const buy = async (id) => {
    console.log("buying: " + id);
    if (myNKNAddress === "") {
      await getNKNAddress()
    }

    if (id === "") {
      alert("Please select an order to buy");
      return;
    }

    axios.post('/buy', {
      txid: id,
      buyerNKNAddress: myNKNAddress,
      buyerShippingAddress: buyerShippingAddress,
      paymentTransactionID: address,
      refundAddress: buyersRefundAddress,
      tradeAsset: tradeAsset,
    }).then((response) => {
      // TODO:: display user facing error/success message
      console.log(response.data);
    });
  }

  // show is called to select a block for the user to view
  const show = (blockName) => {
    switch (blockName) {
      case "browse":
        setShowBrowseOrders(true);
        setshowPendingPayOrders(false);
        setShowBuyOrder(false);
        setShowPrivateKeys(false);
        setShowHomePage(false);
        return
      case "pk":
        setShowBrowseOrders(false);
        setshowPendingPayOrders(false);
        setShowBuyOrder(false);
        setShowPrivateKeys(true);
        setShowHomePage(false);
        return
      case "sell":
        setShowBrowseOrders(false);
        setshowPendingPayOrders(false);
        setShowBuyOrder(true);
        setShowPrivateKeys(false);
        setShowHomePage(false);
        return
      case "payorder":
        setShowBrowseOrders(false);
        setshowPendingPayOrders(true);
        setShowBuyOrder(false);
        setShowPrivateKeys(false);
        setShowHomePage(false);
        return
      case "home":
        setShowBrowseOrders(false);
        setshowPendingPayOrders(false);
        setShowBuyOrder(false);
        setShowPrivateKeys(false);
        setShowHomePage(true);
        return
      case "nav":
        setShowNav(!showNav);
    }
  }


  return (
    <div className="App"
      style={{
        backgroundColor: "#282c34",
        paddingTop: "2rem",
      }}>
      <h1>
        <span
          style={{
            color: '#3EB489',
          }}>
          <img src={returnLogo("any")} alt="Tea Party Logo" width="100" height="100" />
        </span>
      </h1>
      <Card
        style={{
          width: "auto",
          margin: 'auto',
          marginTop: '2rem',
          marginBottom: '2rem',
          padding: '2rem',
          border: 'dark',
          backgroundColor: "#3EB489",
          color: "#023020",
          fontWeight: "bold",
          textAlign: "center",

        }}
      >

        {/* <img src={returnLogo("burger")} style={{ background: "#023020"}} alt="Tea Party Logo" width="25" height="25" onClick={() => show("nav")} /> 
        {showNav ?  */}
        <div>
          <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200, alignSelf: "center" }} variant="secondary" onClick={() => purchaseTransaction()}> Pay Transaction Fee</Button>
          {"       "}
          <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200, alignSelf: "center" }} variant="secondary" onClick={() => show("browse") && listOrders()}>Browse</Button>
          {"       "}
          <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200, alignSelf: "center" }} variant="secondary" onClick={() => show("sell")}>New Trade</Button>
          {"       "}
          <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200, alignSelf: "center" }} variant="secondary" onClick={() => { show("payorder") }}>Pending Pay Orders {" "}
            <span style={{ color: 'lightgreen' }}>{pendingPayNumberAmmount}</span></Button>
          {"      "}
          <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200, alignSelf: "center" }} variant="secondary" onClick={() => show("pk")}>Private Keys </Button>
        </div>
        {/* : null} */}
      </Card>

      <Card
        style={{
          width: 'auto',
          margin: 'auto',
          marginTop: '2rem',
          marginBottom: '2rem',
          padding: '2rem',
          border: 'dark',
          backgroundColor: "#3EB489",
          minHeight: '50vh',
          color: "#3EB489"
        }}
      >

        {/* Default/ Home Page */}
        {showHomePage &&
          <Card
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              boarder: 'dark',
              padding: '1rem',
              width: 'auto',
              contentAlign: 'left',
              margin: 'auto',
              backgroundColor: '#282c34',
              color: '#3EB489',
              fontWeight: 'bold'
            }}>

            <Card.Title style={{ color: "#3EB489" }}>
              <div
                style={{
                  color: '#3EB489',
                  fontWeight: 'bold',
                  borderColor: 'white',
                  border: 'white',
                }}>
              </div>
            </Card.Title>

            <div
              style={{
                color: '#3EB489',
                fontWeight: 'bold',
                border: 'dark',
              }}>

              <Card.Text>
                <div
                  style={{
                    color: '#3EB489',
                    fontWeight: 'bold',
                    border: 'dark',

                  }}>
                  <h2>
                    <p style={{ color: "#3EB489" }}>Thank you {address} for participating in the beta release of <span style={{ color: "#3EB489" }}>Tea</span> </p>
                  </h2>
                </div>
                <p></p>

              </Card.Text>

              <Card
                style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                  boarder: 'dark',
                  borderColor: '#3EB489',
                  padding: '1rem',
                  width: 'auto',
                  contentAlign: 'left',
                  margin: 'auto',
                  backgroundColor: '#282c34',
                  color: '#3EB489',
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                }}>

                If this is your first time using Tea, have a look below for a quick overview on how to use Tea

                <p></p>
                <Card
                  style={{
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    boarder: 'dark',
                    borderColor: '#3EB489',
                    padding: '1rem',
                    width: 'auto',
                    alignItems: 'left',
                    margin: 'auto',
                    backgroundColor: '#282c34',
                    color: '#3EB489',
                    fontWeight: 'bold',
                    fontSize: '1rem'
                  }}>

                  <ul style={{ textAlign: "left" }}>
                    <li><Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200 }} variant="secondary" onClick={() => purchaseTransaction()}> Pay Transaction Fee</Button> Pay for a transaction fee.</li>
                    <p></p>
                    <li><Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200 }} variant="secondary" onClick={() => show("browse") && listOrders()}> Browse</Button> View all the current trades avaliable.</li>
                    <p></p>
                    <li><Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200 }} variant="secondary" onClick={() => show("sell")}> New Trade </Button>
                      {" "}Create a new trade.</li>
                    <p></p>
                    <li><Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200 }} variant="secondary" onClick={() => { show("payorder") }}> Pending Pay Orders {" "}
                      <span style={{ color: 'lightgreen' }}>{pendingPayNumberAmmount}</span></Button> Vew all the trades you have initiated and are waiting for payment.</li>
                    <p></p>
                    <li><Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold", width: 200 }} variant="secondary" onClick={() => show("pk")}>Private Keys </Button>
                      View stored private keys.</li>
                  </ul>

                </Card>
              </Card>
            </div>
          </Card>

        }




        {/* browse Orders */}
        <Card.Body>
          {showBrowseOrders ?
            <Card style={{
              width: 'auto',
              margin: 'auto',
              marginTop: '2rem',
              marginBottom: '2rem',
              padding: '2rem',
              border: 'dark',
              backgroundColor: '#282c34',
              color: '#3EB489',
              fontWeight: 'bold'
            }}

            >
              <Dropdown
                style={{
                  marginTop: '1rem',
                  marginBottom: '1rem',
                }}>
                Filter:{"  "}
                <Dropdown.Toggle variant="secondary"
                  style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }}
                  id="dropdown-basic">
                  <img src={returnLogo(sortBy)} alt="Tea Party Logo" width="25" height="25" /> <span> {sortBy}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }}>
                  <Dropdown.Item onClick={() => setSortBy("polygon")}> <img src={returnLogo("polygon")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}>  Polygon </span></Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("ethereum")}><img src={returnLogo("ethereum")} alt="Tea Party Logo" width="25" height="25" />  <span style={{ color: "#3EB489" }}> Ethereum</span> </Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("mineonlium")}><img src={returnLogo("mineonlium")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> MineOnlium</span></Dropdown.Item>
                  {/* <Dropdown.Item onClick={() => setSortBy("kaspa")}>Kaspa</Dropdown.Item>
                <Dropdown.Item onClick={() => setSortBy("radiant")}>Radiant</Dropdown.Item> */}
                  <Dropdown.Item onClick={() => setSortBy("celo")}><img src={returnLogo("celo")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Celo</span></Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("solana")}><img src={returnLogo("solana")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Solana</span></Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("octa")}><img src={returnLogo("octa")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Octa</span></Dropdown.Item>
                  <Dropdown.Item onClick={() => setSortBy("ethOne")}><img src={returnLogo("ethOne")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> ETHOne</span></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }} variant="secondary" onClick={listOrders}>Refresh</Button>
              {currentOpenOrders.map((order) => (
                <Card style={{
                  backgroundColor: '#282c34',
                  color: '#3EB489',
                  fontWeight: 'bold'
                }}>
                  {order.locked === false && (order.currency === sortBy || order.tradeAsset == sortBy) ?
                    <Card
                      style={{
                        width: 'auto',
                        margin: 'auto',
                        marginTop: '2rem',
                        marginBottom: '2rem',
                        padding: '2rem',
                        border: 'dark',
                        backgroundColor: '#282c34',
                        color: '#3EB489',
                        fontWeight: 'bold',
                        borderColor: '#3EB489'
                      }}

                    >
                      <Card.Title>
                        Order: {order.txid}
                      </Card.Title>
                      <Card.Body>
                        <Container>
                          <Row>
                            <Col>
                              <Container
                                style={{
                                  padding: '1rem',
                                  borderRadius: '1rem'
                                }}
                              >
                                <Row>
                                  <Col>
                                    <span>
                                      Offered Currency: </span>
                                    <div>
                                      <span>
                                        {web3.utils.fromWei(order.amount.toString(), "ether")} <img src={returnLogo(order.currency)} alt="Tea Party Logo" width="25" height="25" />
                                        {/* {"  " + order.currency} */}
                                      </span>
                                    </div>
                                  </Col>
                                  <Col>
                                    <span>
                                      Trading Pair </span>
                                    <div
                                      style={{
                                        color: 'black',
                                        fontSize: '1rem',
                                        fontWeight: 'bold',
                                        backgroundColor: '#282c34',
                                        color: '#3EB489',
                                      }}>
                                      <span>
                                        {web3.utils.fromWei(order.price.toString(), "ether")} <img src={returnLogo(order.tradeAsset)} alt="Tea Party Logo" width="25" height="25" />
                                        {order.tradeAsset === "ANY" ?
                                          " USD" :
                                          " "}
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Container>
                            </Col>
                          </Row>
                          {/* Here we have some example Buy Order Functionality */}
                          <Card
                            style={{
                              border: 'dark',
                              marginTop: '1rem',
                              marginBottom: '1rem',
                              padding: '1rem',
                              width: 'auto',
                              contentAlign: 'center',
                              margin: 'auto',
                              backgroundColor: 'lightgrey',
                              backgroundColor: '#282c34',
                              color: '#3EB489',
                              fontWeight: 'bold'
                            }}
                          >
                            <Card.Title>
                              Start a Trade
                            </Card.Title>
                            <input style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="Buyers Refund Address"
                              onChange={(e) => setBuyersRefundAddress(e.target.value)} />
                            <input style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="Buyers Shipping Address"
                              onChange={(e) => setBuyerShippingAddress(e.target.value)} />
                            <input style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="Buyers Payment Transaction ID"
                              onChange={(e) => setBuyersPaymentTransactionID(e.target.value)} />
                            {order.tradeAsset === "ANY" ?
                              <div
                                style={{
                                  marginTop: '1rem',
                                  marginBottom: '1rem',
                                  boarder: 'dark',
                                  padding: '1rem',
                                  width: 'auto',
                                  contentAlign: 'center',
                                  margin: 'auto'
                                }}>
                                <Dropdown
                                  style={{
                                    marginTop: '1rem',
                                    marginBottom: '1rem'
                                  }}>
                                  Select Trade Asset:
                                  <Dropdown.Toggle style={{ backgroundColor: "#023020", color: "#3EB489" }} variant="secondary" id="dropdown-basic">
                                    <img src={returnLogo(tradeAsset)} alt="Tea Party Logo" width="25" height="25" /> {" "} <span> {tradeAsset}</span>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }}>
                                    <Dropdown.Item onClick={() => setTradeAsset("polygon")}><img src={returnLogo("polygon")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}>  Polygon </span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTradeAsset("ethereum")}><img src={returnLogo("ethereum")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}> Ethereum</span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTradeAsset("mineonlium")}><img src={returnLogo("mineonlium")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}> MineOnlium</span></Dropdown.Item>
                                    {/* <Dropdown.Item onClick={() => setTradeAsset("kaspa")}>Kaspa</Dropdown.Item>
                                  <Dropdown.Item onClick={() => setTradeAsset("radiant")}>Radiant</Dropdown.Item> */}
                                    <Dropdown.Item onClick={() => setTradeAsset("celo")}><img src={returnLogo("celo")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}> Celo</span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTradeAsset("solana")}><img src={returnLogo("solana")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}> Solana</span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTradeAsset("octa")}><img src={returnLogo("octa")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}> Octa</span></Dropdown.Item>
                                    <Dropdown.Item onClick={() => setTradeAsset("ethOne")}><img src={returnLogo("ethOne")} alt="Tea Party Logo" width="25" height="25" /><span style={{ color: "#3EB489" }}> ETHOne</span></Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                              : null
                            }
                            <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }} variant="secondary" onClick={() => {
                              if (order.tradeAsset === "ANY") {
                                setTradeAsset(tradeAsset)
                              } else {
                                setTradeAsset(order.tradeAsset)
                              }
                              
                              buy(order.txid)
                            }}>Buy</Button>
                          </Card>

                        </Container>
                      </Card.Body>
                    </Card>
                    : null
                  }
                </Card >


              ))}

            </Card >
            : null}
        </Card.Body >




        {/* Sell Order */}
        {showBuyOrder ?
          <Card.Body
            style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              boarder: 'dark',
              padding: '1rem',
              width: 'auto',
              contentAlign: 'center',
              margin: 'auto',
              backgroundColor: '#282c34',
              color: '#3EB489',
              fontWeight: 'bold'
            }}>
            <Card.Title
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                boarder: 'dark',
                padding: '1rem',
                width: 'auto',
                contentAlign: 'center',
                margin: 'auto',
                backgroundColor: '#282c34',
                color: '#3EB489',
                fontWeight: 'bold'
              }}
            >
              Create A New Trade
            </Card.Title>
            <Form
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                boarder: 'dark',
                padding: '1rem',
                width: 'auto',
                contentAlign: 'left',
                margin: 'auto',
                backgroundColor: '#282c34',
                color: '#3EB489',
                fontWeight: 'bold',
              }}>
              <Form.Group controlId="formListOrder">
                <Row>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto',
                    }}>
                    Currency
                  </Col>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      margin: 'auto',
                      textAlign: 'left'
                    }}>
                    <Dropdown>
                      <Dropdown.Toggle style={{ backgroundColor: "#023020", color: "#3EB489" }} variant="secondary" id="dropdown-basic">
                        <img src={returnLogo(currency)} alt="Tea Party Logo" width="25" height="25" /> {" "} <span> {currency}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }}>
                        <Dropdown.Item onClick={() => setCurrency("polygon")}><img src={returnLogo("polygon")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}>  Polygon </span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setCurrency("ethereum")}><img src={returnLogo("ethereum")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}>  Ethereum</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setCurrency("mineonlium")}><img src={returnLogo("mineonlium")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> MineOnlium</span></Dropdown.Item>
                        {/* <Dropdown.Item onClick={() => setCurrency("kaspa")}>Kaspa</Dropdown.Item>
                  <Dropdown.Item onClick={() => setCurrency("radiant")}>Radiant</Dropdown.Item> */}
                        <Dropdown.Item onClick={() => setCurrency("celo")}><img src={returnLogo("celo")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Celo</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setCurrency("solana")}><img src={returnLogo("solana")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Solana</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setCurrency("octa")}><img src={returnLogo("octa")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Octa</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setCurrency("ethOne")}><img src={returnLogo("ethOne")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> ETHOne</span></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formListAmount">
                <Row>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto'
                    }}>
                    <Form.Label>Amount</Form.Label>
                  </Col>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'left',
                      margin: 'auto'
                    }}>
                    <Form.Control style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="" onChange={(e) => setAmount(e.target.value)} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formListAmount">
                <Row>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto'
                    }}>
                    <Form.Label>Pair</Form.Label>
                  </Col>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'left',
                      margin: 'auto'
                    }}>
                    <Dropdown
                      style={{
                        marginTop: '1rem',
                        marginBottom: '1rem'
                      }}>
                      <Dropdown.Toggle style={{ backgroundColor: "#023020", color: "#3EB489" }} variant="secondary" id="dropdown-basic">
                        <img src={returnLogo(tradeAsset)} alt="Tea Party Logo" width="25" height="25" />{" "} <span> {tradeAsset}</span>
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }}>
                        <Dropdown.Item onClick={() => setTradeAsset("polygon")}><img src={returnLogo("polygon")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}>  Polygon </span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("ethereum")}><img src={returnLogo("ethereum")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}>  Ethereum</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("mineonlium")}><img src={returnLogo("mineonlium")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> MineOnlium</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("celo")}><img src={returnLogo("celo")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Celo</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("solana")}><img src={returnLogo("solana")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Solana</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("octa")}><img src={returnLogo("octa")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> Octa</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("ethOne")}><img src={returnLogo("ethOne")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}> ETHOne</span></Dropdown.Item>
                        <Dropdown.Item onClick={() => setTradeAsset("ANY")}><img src={returnLogo("ANY")} alt="Tea Party Logo" width="25" height="25" /> <span style={{ color: "#3EB489" }}>Any</span></Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formListAmount">
                <Row>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto'
                    }}>
                    <Form.Label>{tradeAsset === "ANY" ? "Price / USD" : "Amount"} </Form.Label>
                  </Col>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto'
                    }}>
                    <Form.Control style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="" onChange={(e) => setPrice(e.target.value)} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="formShippingAddress">
                <Row>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto'
                    }}>
                    <Form.Label>Shipping Address</Form.Label>
                  </Col>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'left',
                      margin: 'auto'
                    }}>
                    <Form.Control style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="" onChange={(e) => setSellerShippingAddress(e.target.value)} />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group controlId="returnShippingAddress">
                <Row>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      textAlign: 'right',
                      margin: 'auto'
                    }}>
                    <Form.Label>Return Shipping Address</Form.Label>
                  </Col>
                  <Col
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      boarder: 'dark',
                      padding: '1rem',
                      width: 'auto',
                      contentAlign: 'left',
                      margin: 'auto'
                    }}>
                    <Form.Control style={{ background: "#023020", color: '#3EB489' }} type="text" placeholder="" onChange={(e) => setSellersRefundAddress(e.target.value)} />
                  </Col>
                </Row>
              </Form.Group>
              <p></p>
              <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }} variant="secondary" onClick={sell}>Sell</Button>
              <br />
              <span>
                {sellOrderResponse}
              </span>
            </Form>
          </Card.Body>
          : null}


        {/* Show Pending Payment */}
        {showPendingPayOrders && userCurrentPendingPayOrders ?
          <Card.Body>
            <Card
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                boarder: 'dark',
                padding: '1rem',
                width: 'auto',
                contentAlign: 'left',
                margin: 'auto',
                backgroundColor: '#282c34',
                color: '#3EB489',
                fontWeight: 'bold'
              }}>
              <div>
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>Pending Pay Orders:</span>
                {(userCurrentPendingPayOrders.length > 0) ? userCurrentPendingPayOrders.map((order) => (
                  <Card
                    style={{
                      width: 'auto',
                      margin: 'auto',
                      marginTop: '2rem',
                      marginBottom: '2rem',
                      padding: '2rem',
                      border: 'dark',
                      backgroundColor: '#282c34'
                    }}
                  >
                    <Card.Title> Pending Pay Order <img src={returnLogo(order.network)} alt="Tea Party Logo" width="25" height="25" /> </Card.Title>
                    <Card.Body>
                      <Card.Text>
                        <span>Address: {order.address}</span>
                        <br />
                        <span>Ammount: {web3.utils.fromWei(order.amount.toString(), "ether")} </span>
                        <br />
                        <span>Network: {order.network}</span>
                        <br />
                      </Card.Text>
                    </Card.Body>
                  </Card>
                )) : <span>No Pending Pay Orders</span>}
              </div>
            </Card>
          </Card.Body>
          : null}


        {/* Show Private Keys */}
        {showPrivateKeys && userPrivateKeys ?
          <Card.Body>
            <div
              style={{
                marginTop: '1rem',
                marginBottom: '1rem',
                boarder: 'dark',
                padding: '1rem',
                width: 'auto',
                contentAlign: 'left',
                margin: 'auto',
                backgroundColor: '#282c34',
                color: '#3EB489',
                fontWeight: 'bold'
              }}>

              <div>
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  }}>Private Keys:</span>
                {/* illeterate through private keys and display a history of the private keys */}
                {/* check that the private keys are not null */}

                {userPrivateKeys.length != null ? userPrivateKeys.map((account) => (
                  <Card
                    style={{
                      marginTop: '1rem',
                      marginBottom: '1rem',
                      border: '1px solid black',
                      padding: '1rem',
                      borderRadius: '5px',
                      color: '#282c34',
                      backgroundColor: '#282c34',
                      border: 'dark',
                      borderColor: '#3EB489',

                    }}>
                    <span style={{
                      color: '#3EB489',
                      fontWeight: 'bold'
                    }}> <h3>Chain:</h3>  <img src={returnLogo(account.chain)} alt="Tea Party Logo" width="25" height="25" />  {account.chain} </span>
                    <span style={{
                      color: '#3EB489',
                      fontWeight: 'bold'
                    }}> <h3>Address:</h3>
                      <span
                        style={{
                          color: '#3EB489',
                          fontWeight: 'bold'
                        }}>{account.address} </span>
                    </span>
                    <span style={{
                      color: '#3EB489',
                      fontWeight: 'bold'
                    }}> <h3>Private Key:</h3> <span
                      style={{
                        color: '#282c34',
                        fontWeight: 'bold'
                      }}>
                        {account.privateKey}</span>
                      <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }} variant="secondary" onClick={() => { navigator.clipboard.writeText(account.privateKey) }}>Copy</Button>
                      <Button style={{ backgroundColor: "#023020", color: "#3EB489", fontWeight: "bold" }} variant="secondary" onClick={(e) => { deletePK(account.address) }}>Delete</Button>
                    </span>
                  </Card>
                )) : <span> No Private Keys</span>}
              </div>
            </div>
          </Card.Body>
          : null}
      </Card >
    </div >
  );
}

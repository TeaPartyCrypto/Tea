package controller

import (
	"math/big"
	"net/http"

	nkn "github.com/nknorg/nkn-sdk-go"
	"go.uber.org/zap"
)

type Controller struct {
	rootHandler http.Handler
	NKNClient   *nkn.MultiClient
	SAASAddress string

	Log *zap.Logger
}

// BuyOrder is a struct that contains the information expected in a buy order
type BuyOrder struct {
	TXID string `json:"txid"`
	// BuyerShippingAddress represents the public key of the account the buyer wants to receive on
	// if the NKN transaction fails
	BuyerShippingAddress string `json:"buyerShippingAddress"`
	// BuyerNKNAddress reflects the  publicly address of the buyer.
	BuyerNKNAddress string `json:"buyerNKNAddress"`
	// PaymentTransactionID reflects the transaction ID of the payment made in MO.
	PaymentTransactionID string `json:"paymentTransactionID"`
	// RefundAddress reflects an address that Party can send a refund to if the NKN transaction fails.
	RefundAddress string `json:"refundAddress"`
	// TradeAsset reflects the asset that the BUYER wishes to obtain. (bitcoin, mineonlium, USDT, etc).
	TradeAsset string `json:"tradeAsset"`
}

// SellOrder contains the information expected in a sell order.
type SellOrder struct {
	// TradeAsset reflects the asset that the SELLER wishes to obtain. (bitcoin, mineonlium, USDT, etc).
	TradeAsset string `json:"tradeAsset"`
	// Price reflects the ammount of TradeAsset the SELLER requires.
	Price int `json:"price"`
	// Currency reflects the currency that the SELLER wishes to trade. (bitcoin, mineonlium, USDT, etc).
	Currency string `json:"currency"`
	// Amount reflects the ammount of Currency the SELLER wishes to trade.
	Amount int `json:"amount"`
	// TXID reflects the Transaction ID of the SELL order to be created.
	TXID string `json:"txid"`
	// Locked tells us if this transaction is pending/proccessing another payment.
	Locked bool `json:"locked" default:false`
	// SellerShippingAddress reflects the public key of the account the seller wants to receive on
	SellerShippingAddress string `json:"sellerShippingAddress"`
	// SellerNKNAddress reflects the  public NKN address of the seller.
	SellerNKNAddress string `json:"sellerNKNAddress"`
	// PaymentTransactionID reflects the transaction ID of the payment made in MO.
	PaymentTransactionID string `json:"paymentTransactionID"`
	// RefundAddress reflects the address of which the funds will be refunded in case of a failure.
	RefundAddress string `json:"refundAddress"`
	// Private reflects if the trade order is to be private or not. I.E. listed in the public
	// market place or not.
	Private bool `json:"private"`
	// OnChain reflects if the trade order is to be finalized on-chain or not.
	OnChain bool `json:"onChain"`
	// Assisted reflects if the trade order is to be assisted by the exchange or not.
	Assisted bool `json:"assisted"`
	// AssistedTradeOrderInformation reflects the information required to assist the trade order.
	AssistedTradeOrderInformation AssistedTradeOrderInformation `json:"assistedTradeOrderInformation"`
}

type AssistedTradeOrderInformation struct {
	// SellersEscrowWallet represents the wallet that the seller has already funded
	// with the currency they wish to trade.
	SellersEscrowWallet   EscrowWallet `json:"sellersEscrowWallet"`
	SellerRefundAddress   string       `json:"sellerRefundAddress"`
	SellerShippingAddress string       `json:"sellerShippingAddress"`
	// TradeAsset reflects the asset that the SELLER wishes to obtain. (bitcoin, mineonlium, USDT, etc).
	TradeAsset string `json:"tradeAsset"`
	// Price reflects the ammount of TradeAsset the SELLER requires.
	Price *big.Int `json:"price"`
	// Currency reflects the currency that the SELLER wishes to trade. (bitcoin, mineonlium, USDT, etc).
	Currency string `json:"currency"`
	// Amount reflects the ammount of Currency the SELLER wishes to trade.
	Amount *big.Int `json:"amount"`
}

type EscrowWallet struct {
	PublicAddress string `json:"publicAddress"`
	PrivateKey    string `json:"privateKey"`
	Chain         string `json:"chain"`
}

// NKNNotification is a struct that contains the information expected in a NKN notification
// from Party.
type NKNNotification struct {
	Address    string `json:"address"`
	Amount     string `json:"amount"`
	Network    string `json:"network"`
	PrivateKey string `json:"privateKey"`
	Chain      string `json:"chain"`
	Error      string `json:"error"`
}

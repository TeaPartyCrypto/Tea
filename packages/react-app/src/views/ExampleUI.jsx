import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";
import {TeaParty} from "./TeaParty";
import Web3 from "web3";

import { Address, Balance, Events } from "../components";

export default function ExampleUI({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {

  const [response, setResponse] = useState("")

  return (
    <div
        style={{
          width: 'auto',
          margin: 'auto',
          marginTop: '2rem',
          marginBottom: '2rem',
          padding: '2rem',
          border: 'dark',
          backgroundColor: "#3EB489",
          color: "#023020",
          fontWeight: "bold"
        }}
    >
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <Button
              onClick={async () => {
                const result = tx(
                  writeContracts.TeaParty.purchaseTransaction({
                    value: Web3.utils.toWei("1", "ether"),
                  }),
                  update => {
                    console.log("📡 Transaction Update:", update);
                    if (update && (update.status === "confirmed" || update.status === 1)) {
                      console.log(" 🍾 Transaction " + update.hash + " finished!");
                      console.log( update.data);
                      alert(Web3.utils.hexToNumber(update.data));
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

                // convert from hex to uint

              }}
            >
Purchase a TeaParty Transaction
            </Button>
      </div>


    </div>
  );
}

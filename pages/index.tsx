import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import { Header } from "../components/header";
import { LotteryEntrance } from "../components/lotteryEntrance";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Smart Contract Lottery</title>
        <meta name="description" content="Smart Contract Lottery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header variant="web3kit" />
      <LotteryEntrance />
    </>
  );
}

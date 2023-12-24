import { Button } from "@material-tailwind/react";
import { ArrowDown, ArrowUp } from "lucide-react";
import toast from "react-hot-toast";

export default function Transaction({ transaction, walletAddress }) {
  return (
    <div className="w-full h-[100px] min-h-[100px] bg-transparent border-black border-[1px] rounded-xl flex p-2 px-3 items-center">
      <div>
        <Button
          color="white"
          className="w-[75px] h-[75px] border-[1px] border-black flex items-center justify-center"
          onClick={() => {
            window.open(
              `https://testnet.vicscan.xyz/tx/${transaction.hash}`,
              "_blank"
            );
          }}
          style={{
            filter:
              transaction.from !== walletAddress
                ? "contrast(210%) brightness(350%)"
                : "contrast(180%) brightness(400%)",
            background:
              transaction.from !== walletAddress
                ? `linear-gradient(160deg, rgba(44,255,0,1), rgba(0,0,0,0)),
	url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                : `
              linear-gradient(320deg, rgba(255,0,38,1), rgba(0,0,0,0)),
	url("data:image/svg+xml,%3Csvg viewBox='0 0 246 246' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.61' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")
    `,
          }}
        >
          {transaction.from === walletAddress ? (
            <ArrowUp className="text-black" size={30} />
          ) : (
            <ArrowDown className="text-black" size={30} />
          )}
        </Button>
      </div>

      <div className="flex w-full h-full items-center justify-between">
        <div className="flex flex-col w-full h-full justify-center ml-2 mt-2">
          <div className="flex items-center justify-between">
            <div className="text-black/70 text-2xl font-semibold">
              {transaction.from === walletAddress ? "Sent to" : "Received from"}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div
              className="text-black/70 text-md font-semibold hover:underline hover:cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(transaction.to);
                toast.success("Address Copied !");
              }}
            >
              {transaction.from === walletAddress
                ? transaction.to.slice(0, 6) + "..." + transaction.to.slice(-4)
                : transaction.from.slice(0, 6) +
                  "..." +
                  transaction.from.slice(-4)}
            </div>
            <div className="text-black/50 text-xl font-semibold mb-2">
              {transaction.from === walletAddress
                ? "-" + (transaction.value / 10 ** 18).toFixed(2) + " VIC"
                : "+" + (transaction.value / 10 ** 18).toFixed(2) + " VIC"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

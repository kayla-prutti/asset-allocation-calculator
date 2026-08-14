import "./PortfolioEditor.css";
import CurrencyInput from "@/components/CurrencyInput/CurrencyInput";
import CryptoInput from "@/components/CryptoInput/CryptoInput";
import { MAX_INVESTMENT_AMOUNT } from "@/utils/portfolio";
import type { CryptoCurrency, CryptoSymbol, PortfolioAsset } from "@/types/exchangeRates";

interface PortfolioEditorProps {
  investmentAmount: number | null;
  onInvestmentAmountChange: (value: number | null) => void;
  assets: PortfolioAsset[];
  currencies: CryptoCurrency[];
  investmentAmountError: string;
  onClearAmount: () => void;
  onResetPortfolio: () => void;
  onSetWeight: (index: number, value: number) => void;
  onSelectAsset: (index: number, symbol: CryptoSymbol) => void;
  onAddAsset: () => void;
  onRemoveAsset: (index: number) => void;
}

export default function PortfolioEditor({
  investmentAmount,
  onInvestmentAmountChange,
  assets,
  currencies,
  investmentAmountError,
  onClearAmount,
  onResetPortfolio,
  onSetWeight,
  onSelectAsset,
  onAddAsset,
  onRemoveAsset,
}: PortfolioEditorProps) {
  return (
    <section className="investment-panel" aria-labelledby="investment-heading">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Build your portfolio</p>
          <h2 id="investment-heading">Choose assets and amount</h2>
        </div>
      </div>
      <CurrencyInput
        modelValue={investmentAmount}
        onChange={onInvestmentAmountChange}
        label="Investment amount"
        inputId="investment-amount"
        placeholder="0"
        currencySymbol="$"
        maxAmount={MAX_INVESTMENT_AMOUNT}
        errorMessage={investmentAmountError}
        action={
          investmentAmount && investmentAmount > 0 ? (
            <button className="reset-button" type="button" onClick={onClearAmount}>
              Clear amount
            </button>
          ) : undefined
        }
      />
      <p className="input-hint">Use the amount you are comfortable allocating today.</p>
      <CryptoInput
        assets={assets}
        currencies={currencies}
        onResetPortfolio={onResetPortfolio}
        onSetWeight={onSetWeight}
        onSelectAsset={onSelectAsset}
        onAddAsset={onAddAsset}
        onRemoveAsset={onRemoveAsset}
      />
    </section>
  );
}

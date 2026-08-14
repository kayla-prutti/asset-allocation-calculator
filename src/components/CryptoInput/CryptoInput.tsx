import { useMemo, useState, type ChangeEvent, type KeyboardEvent } from "react";
import "./CryptoInput.css";
import { getCurrencyName, isSymbolTakenElsewhere, validateMix } from "@/utils/portfolio";
import type { CryptoCurrency, CryptoSymbol, PortfolioAsset } from "@/types/exchangeRates";

interface CryptoInputProps {
  assets: PortfolioAsset[];
  currencies: CryptoCurrency[];
  onResetPortfolio: () => void;
  onSetWeight: (index: number, value: number) => void;
  onSelectAsset: (index: number, symbol: CryptoSymbol) => void;
  onAddAsset: () => void;
  onRemoveAsset: (index: number) => void;
}

export default function CryptoInput({
  assets,
  currencies,
  onResetPortfolio,
  onSetWeight,
  onSelectAsset,
  onAddAsset,
  onRemoveAsset,
}: CryptoInputProps) {
  const [openAssetIndex, setOpenAssetIndex] = useState<number | null>(null);
  const [assetSearch, setAssetSearch] = useState("");

  const filteredCurrencies = useMemo(() => {
    const query = assetSearch.trim().toLowerCase();
    return query
      ? currencies.filter(
          (currency) =>
            currency.name.toLowerCase().includes(query) ||
            currency.code.toLowerCase().includes(query),
        )
      : currencies;
  }, [assetSearch, currencies]);

  const mix = useMemo(() => validateMix(assets), [assets]);

  function currencyName(symbol: CryptoSymbol) {
    return getCurrencyName(currencies, symbol);
  }
  function isSelectedElsewhere(index: number, symbol: CryptoSymbol) {
    return isSymbolTakenElsewhere(assets, index, symbol);
  }
  function toggleAssetMenu(index: number) {
    setOpenAssetIndex((current) => (current === index ? null : index));
    setAssetSearch("");
  }
  function updateWeight(index: number, event: ChangeEvent<HTMLInputElement>) {
    onSetWeight(index, Number(event.target.value));
  }
  function chooseAsset(index: number, symbol: CryptoSymbol) {
    if (!isSelectedElsewhere(index, symbol)) onSelectAsset(index, symbol);
    setOpenAssetIndex(null);
  }
  function removeAsset(index: number) {
    onRemoveAsset(index);
    setOpenAssetIndex(null);
  }
  function resetPortfolio() {
    onResetPortfolio();
    setOpenAssetIndex(null);
  }
  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape") setOpenAssetIndex(null);
  }

  return (
    <fieldset className={`allocation-editor${!mix.isComplete ? " invalid" : ""}`} aria-invalid={!mix.isComplete}>
      <div className="mix-editor-heading">
        <legend>Choose your mix</legend>
        <button className="reset-mix-button" type="button" onClick={resetPortfolio}>
          Reset mix
        </button>
      </div>
      <p>
        Set each weight yourself.{" "}
        <strong
          className={`mix-total${!mix.isComplete && !mix.isOverAllocated ? " incomplete" : ""}${mix.isOverAllocated ? " over" : ""}`}
        >
          {mix.totalWeight}% total
        </strong>
      </p>
      <div className="asset-picker-list">
        {assets.map((asset, index) => (
          <div
            key={asset.id}
            className={`asset-picker-row${assets.length > 2 ? " is-removable" : ""}${openAssetIndex === index ? " menu-open" : ""}`}
          >
            <div className="asset-select">
              <span>Crypto</span>
              <button
                id={`asset-${asset.id}`}
                className="asset-select-trigger"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={openAssetIndex === index}
                aria-controls={`asset-options-${asset.id}`}
                onClick={() => toggleAssetMenu(index)}
                onKeyDown={handleTriggerKeyDown}
              >
                <span>{currencyName(asset.symbol)}</span>
                <small>{asset.symbol}</small>
                <i aria-hidden="true"></i>
              </button>
              {openAssetIndex === index && (
                <div className="asset-options">
                  <input
                    value={assetSearch}
                    onChange={(event) => setAssetSearch(event.target.value)}
                    type="search"
                    placeholder="Search assets"
                    aria-label="Search cryptocurrencies"
                  />
                  <ul id={`asset-options-${asset.id}`} role="listbox" aria-labelledby={`asset-${asset.id}`}>
                    {filteredCurrencies.map((currency) => (
                      <li key={currency.code} role="option" aria-selected={asset.symbol === currency.code}>
                        <button
                          type="button"
                          disabled={isSelectedElsewhere(index, currency.code)}
                          onClick={() => chooseAsset(index, currency.code)}
                        >
                          <span>{currency.name}</span>
                          <small>{currency.code}</small>
                        </button>
                      </li>
                    ))}
                    {filteredCurrencies.length === 0 && <li className="no-assets">No assets found</li>}
                  </ul>
                </div>
              )}
            </div>
            <label className="weight-input" htmlFor={`weight-${asset.id}`}>
              <span>Weight</span>
              <span className="weight-control">
                <input
                  id={`weight-${asset.id}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  value={asset.percentage}
                  onChange={(event) => updateWeight(index, event)}
                />
                <b aria-hidden="true">%</b>
              </span>
            </label>
            {assets.length > 2 && (
              <button
                className="remove-asset-button"
                type="button"
                aria-label={`Remove ${currencyName(asset.symbol)}`}
                onClick={() => removeAsset(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
      {mix.errorMessage && (
        <p className="mix-error" role="alert">
          {mix.errorMessage}
        </p>
      )}
      {assets.length < 5 && (
        <button className="add-asset-button" type="button" onClick={onAddAsset}>
          + Add another asset
        </button>
      )}
    </fieldset>
  );
}

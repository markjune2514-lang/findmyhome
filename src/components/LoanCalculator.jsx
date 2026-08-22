import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';

export default function LoanCalculator({ priceStr }) {
  const getInitialPrice = (val) => {
    if (!val) return 3000000;
    const str = String(val);
    const num = parseFloat(str.replace(/,/g, ''));
    if (isNaN(num)) return 3000000;
    if (num < 1000) return num * 1000000; 
    return num;
  };

  const [propertyPrice, setPropertyPrice] = useState(getInitialPrice(priceStr));
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [interestRate, setInterestRate] = useState(3.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    const principal = propertyPrice - (propertyPrice * (downPaymentPercent / 100));
    const monthlyRate = (interestRate / 100) / 12;
    const numberOfPayments = loanTerm * 12;

    if (principal > 0 && monthlyRate > 0 && numberOfPayments > 0) {
      const mathPower = Math.pow(1 + monthlyRate, numberOfPayments);
      const payment = principal * ((monthlyRate * mathPower) / (mathPower - 1));
      setMonthlyPayment(payment);
    } else {
      setMonthlyPayment(0);
    }
  }, [propertyPrice, downPaymentPercent, interestRate, loanTerm]);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
          <Calculator size={18} />
        </div>
        <h4 className="m-0 text-base font-bold text-gray-800">เครื่องคำนวณสินเชื่อ</h4>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">ราคาอสังหาฯ (บาท)</label>
          <input 
            type="number" 
            value={propertyPrice} 
            onChange={(e) => setPropertyPrice(Number(e.target.value))}
            className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 font-medium"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-bold text-gray-600">เงินดาวน์ ({downPaymentPercent}%)</label>
            <span className="text-xs text-gray-500 font-medium">{(propertyPrice * (downPaymentPercent/100)).toLocaleString()} บาท</span>
          </div>
          <input 
            type="range" 
            min="0" max="40" step="5"
            value={downPaymentPercent} 
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="w-full accent-orange-500"
          />
          <div className="flex justify-between mt-1 text-[10px] text-gray-400">
            <span>0%</span>
            <span>10%</span>
            <span>20%</span>
            <span>30%</span>
            <span>40%</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-600 mb-1">ดอกเบี้ยต่อปี (%)</label>
            <input 
              type="number" step="0.1"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 font-medium"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-gray-600 mb-1">ระยะเวลากู้ (ปี)</label>
            <select
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 font-medium bg-white"
            >
              <option value={10}>10 ปี</option>
              <option value={15}>15 ปี</option>
              <option value={20}>20 ปี</option>
              <option value={25}>25 ปี</option>
              <option value={30}>30 ปี</option>
              <option value={35}>35 ปี</option>
              <option value={40}>40 ปี</option>
            </select>
          </div>
        </div>

        <div className="mt-5 bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-between">
          <div>
            <span className="block text-xs text-gray-500 font-medium mb-0.5">ยอดผ่อนชำระโดยประมาณ</span>
            <div className="text-xl font-black text-slate-800">
              {monthlyPayment > 0 ? monthlyPayment.toLocaleString(undefined, {maximumFractionDigits:0}) : '0'} <span className="text-sm text-gray-500 font-medium">บาท/เดือน</span>
            </div>
          </div>
        </div>
        
        <p className="text-[10px] text-gray-400 leading-tight mt-2 text-center">
          *ยอดนี้เป็นการคำนวณเบื้องต้นเท่านั้น ยอดจริงอาจเปลี่ยนแปลงตามเงื่อนไขของแต่ละธนาคาร
        </p>
      </div>
    </div>
  );
}

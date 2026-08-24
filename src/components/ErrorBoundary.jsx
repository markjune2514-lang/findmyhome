import React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 text-slate-800 text-center">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-slate-200">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900">เกิดข้อผิดพลาดในการโหลดหน้าเว็บ</h2>
            <p className="text-slate-500 text-sm mb-6">ระบบตรวจพบข้อผิดพลาด กรุณากดปุ่มด้านล่างเพื่อรีโหลดใหม่อีกครั้ง</p>
            {this.state.error && (
              <div className="bg-slate-100 p-3 rounded-xl text-xs text-slate-600 text-left mb-6 font-mono overflow-x-auto max-h-24">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={this.handleReload} className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all border-none cursor-pointer">
                <RotateCcw size={16} /> รีโหลดหน้าเว็บ
              </button>
              <button onClick={this.handleGoHome} className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-full font-bold text-sm border border-slate-300 transition-all cursor-pointer">
                <Home size={16} /> กลับหน้าแรก
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
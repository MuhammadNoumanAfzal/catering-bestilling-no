import { Component } from 'react';
import { useTranslation } from 'react-i18next';
import { recoverModuleLoad } from '../../utils/moduleLoadRecovery.js';
class ErrorBoundary extends Component {
  state={failed:false};
  static getDerivedStateFromError(){return {failed:true};}
  componentDidCatch(error){recoverModuleLoad(error);}
  render(){
    if(!this.state.failed)return this.props.children;
    const nb=this.props.norwegian;
    return <main role="alert" className="flex min-h-screen items-center justify-center bg-[#faf7f3] px-5"><section className="w-full max-w-md rounded-2xl border border-[#e8dccc] bg-white p-7 shadow-sm"><h1 className="text-xl font-bold text-[#33261c]">{nb?'Siden kunne ikke lastes':'This page could not load'}</h1><p className="mt-3 text-sm leading-6 text-[#847261]">{nb?'Oppdater siden for å laste inn den nyeste versjonen.':'Reload the page to load the latest version.'}</p><button type="button" onClick={()=>window.location.reload()} className="mt-5 rounded-lg bg-[#cc6634] px-5 py-3 text-sm font-semibold text-white">{nb?'Prøv igjen':'Try again'}</button><a href="/" className="ml-4 text-sm text-[#9a6541] underline">{nb?'Til forsiden':'Go to home'}</a></section></main>;
  }
}
export default function PageErrorBoundary({children}){
  const {i18n}=useTranslation();
  return <ErrorBoundary norwegian={/^(no|nb|nn)/i.test(i18n.resolvedLanguage||i18n.language)}>{children}</ErrorBoundary>;
}

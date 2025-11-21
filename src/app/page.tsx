'use client'
import {FileText,Upload,Download,Share2,Lock,CheckCircle,Clock} from 'lucide-react'
const docs=[
  {id:'1',name:'Purchase Agreement.pdf',type:'Contract',size:'512 KB',date:'2024-11-18',status:'signed',signers:['Client','Agent']},
  {id:'2',name:'Property Disclosure.pdf',type:'Disclosure',size:'245 KB',date:'2024-11-15',status:'pending',signers:['Client']},
  {id:'3',name:'Pre-Approval Letter.pdf',type:'Financial',size:'180 KB',date:'2024-11-10',status:'completed',signers:['Bank','Client']},
]
export default function DocManagement(){
  return(
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b"><div className="max-w-7xl mx-auto px-4 py-4"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><FileText className="w-8 h-8 text-blue-600"/><div><h1 className="text-2xl font-bold">Document Management</h1><p className="text-sm text-gray-500">Secure storage and e-signatures</p></div></div><button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Upload className="w-5 h-5"/>Upload</button></div></div></header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Total Documents</p><p className="text-3xl font-bold">{docs.length}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Pending Signatures</p><p className="text-3xl font-bold text-yellow-600">{docs.filter(d=>d.status==='pending').length}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Completed</p><p className="text-3xl font-bold text-green-600">{docs.filter(d=>d.status==='signed'||d.status==='completed').length}</p></div>
          <div className="bg-white rounded-lg shadow p-6"><p className="text-sm text-gray-600">Storage Used</p><p className="text-3xl font-bold">2.4 GB</p></div>
        </div>
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b"><h2 className="text-xl font-semibold">Recent Documents</h2></div>
          <div className="divide-y">
            {docs.map(doc=>(
              <div key={doc.id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <FileText className="w-12 h-12 text-blue-600"/>
                  <div><h3 className="font-semibold">{doc.name}</h3><p className="text-sm text-gray-600">{doc.type} • {doc.size} • {doc.date}</p><div className="flex gap-2 mt-1">{doc.signers.map((s,i)=><span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">{s}</span>)}</div></div>
                </div>
                <div className="flex items-center gap-3">
                  {doc.status==='signed'&&<span className="flex items-center gap-1 text-green-600"><CheckCircle className="w-4 h-4"/>Signed</span>}
                  {doc.status==='pending'&&<span className="flex items-center gap-1 text-yellow-600"><Clock className="w-4 h-4"/>Pending</span>}
                  {doc.status==='completed'&&<span className="flex items-center gap-1 text-blue-600"><CheckCircle className="w-4 h-4"/>Complete</span>}
                  <button className="p-2 hover:bg-gray-100 rounded"><Download className="w-5 h-5"/></button>
                  <button className="p-2 hover:bg-gray-100 rounded"><Share2 className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

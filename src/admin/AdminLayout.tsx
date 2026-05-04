import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, LogOut, TrendingUp, Image as ImageIcon, Upload, Loader2, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export function AdminLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Login Form States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    // Convertemos o username 'savio' para um email válido para o Supabase
    const email = `${username}@admin.com`;

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login erro:", error.message);
      toast.error('Erro no login: ' + error.message);
    } else {
      toast.success('Login realizado com sucesso!');
    }

    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-slate-100">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Lock size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Acesso Restrito</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: savio"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" disabled={isLoggingIn}>
              {isLoggingIn ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
              Entrar no Painel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-wider">STATICOLOR</h1>
          <p className="text-slate-400 text-sm mt-1">Painel Administrativo</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-medium transition-colors">
            <ImageIcon size={20} />
            Galeria & Cards
          </a>
          <a href="#trafego" className="flex items-center gap-3 text-slate-300 hover:bg-slate-800 hover:text-white px-4 py-3 rounded-lg font-medium transition-colors">
            <TrendingUp size={20} />
            Tráfego do Site
          </a>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800">
            <LogOut size={20} className="mr-3" />
            Sair do sistema
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-slate-800">Painel Admin</h1>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut size={20} className="text-slate-600" />
          </Button>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

// -------------------------------------------------------------
// DASHBOARD COMPONENT
// -------------------------------------------------------------

type Card = {
  id: number;
  title: string;
  category: string;
  image_url: string;
};

function Dashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCards = async () => {
    const { data, error } = await supabase.from('gallery_cards').select('*').order('id', { ascending: true });
    if (!error && data) {
      setCards(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setTitle(card.title);
    setCategory(card.category);
    setImageFile(null);
  };

  const handleCancelEdit = () => {
    setEditingCard(null);
    setTitle('');
    setCategory('');
    setImageFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    setIsSaving(true);

    let imageUrl = editingCard.image_url;

    // Se escolheu uma nova imagem, faz upload pro Supabase Storage
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `cards/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, imageFile);

      if (uploadError) {
        toast.error('Erro ao enviar imagem: ' + uploadError.message);
        setIsSaving(false);
        return;
      }

      // Pega a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      imageUrl = publicUrl;
    }

    // Atualiza no banco de dados
    const { error } = await supabase
      .from('gallery_cards')
      .update({ title, category, image_url: imageUrl })
      .eq('id', editingCard.id);

    if (error) {
      toast.error('Erro ao salvar card.');
    } else {
      toast.success('Card atualizado com sucesso!');
      fetchCards();
      handleCancelEdit();
    }

    setIsSaving(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* SEÇÃO DE TRÁFEGO */}
      <section id="trafego" className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <TrendingUp size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tráfego do Site</h2>
            <p className="text-sm text-slate-500">Visão geral dos visitantes</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-2 border border-slate-100 flex flex-col items-center justify-center text-center min-h-[500px] relative">
          {/* 
            DICA: Para mostrar o Google Analytics aqui:
            1. Crie um dashboard no Looker Studio (lookerstudio.google.com) conectado ao seu GA4.
            2. Vá em Arquivo > Incorporar Relatório.
            3. Copie o link e substitua no 'src' abaixo.
          */}
          <iframe
            src="https://datastudio.google.com/embed/reporting/acee5a10-f206-4d44-a497-e6af9c08880e/page/RA5wF" // Substitua pelo seu link real
            className="w-full h-[600px] rounded-lg shadow-inner bg-white"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>

          <div className="absolute bottom-4 right-4">
            <Button asChild size="sm" variant="outline" className="bg-white/80 backdrop-blur">
              <a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer">
                Ver GA4 Completo
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE CARDS */}
      <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ImageIcon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Galeria de Imagens</h2>
              <p className="text-sm text-slate-500">Gerencie as fotos exibidas no site</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-blue-600" /></div>
          ) : editingCard ? (
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <Upload size={18} /> Editando Card: {editingCard.title}
              </h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Título da Imagem</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria (ex: Móveis, Indústria)</Label>
                    <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Nova Imagem (opcional)</Label>
                  <div className="flex items-center gap-4">
                    {editingCard.image_url && !imageFile && (
                      <img src={editingCard.image_url} alt="Current" className="h-16 w-16 object-cover rounded shadow-sm" />
                    )}
                    <Input id="image" type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={18} /> : null}
                    Salvar Alterações
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cards.map((card) => (
                <div key={card.id} className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-square relative bg-slate-100">
                    {card.image_url ? (
                      <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">Sem Imagem</div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(card)}>
                        Editar Card
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{card.title}</h4>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full mt-2 inline-block">
                      {card.category}
                    </span>
                  </div>
                </div>
              ))}

              {cards.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-500">
                  Nenhum card cadastrado no banco de dados.
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

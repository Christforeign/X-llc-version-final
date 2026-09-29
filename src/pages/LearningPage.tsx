import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Award,
  Play,
  ArrowRight,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  Download,
  FileCode,
  FileText,
  Video,
  ShoppingCart,
  Check,
  Sparkles,
  Lock,
  Wallet
} from 'lucide-react';
import { db } from '../services/db';
import { authService } from '../services/authService';
import { walletService } from '../services/walletService';
import { CertificateGenerator } from '../components/CertificateGenerator';
import { Course, Certificate, MarketplaceItem } from '../models/types';
import { CustomServiceRequestModal } from '../components/CustomServiceRequestModal';

interface LearningPageProps {
  onOpenAuth: () => void;
  onNavigate: (path: string) => void;
  onAddToCart?: (item: MarketplaceItem) => void;
}

export const LearningPage: React.FC<LearningPageProps> = ({ onOpenAuth, onNavigate, onAddToCart }) => {
  const currentUser = authService.getCurrentUser();
  const wallet = currentUser ? db.getWallet(currentUser.id) : null;
  const courses = db.getCourses();
  const [activeMainTab, setActiveMainTab] = useState<'store' | 'curriculum'>('store');
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Curriculum State
  const [selectedCourse, setSelectedCourse] = useState<Course>(courses[0]);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'syllabus' | 'quiz' | 'certificate'>('syllabus');

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [generatedCertificate, setGeneratedCertificate] = useState<Certificate | null>(null);

  // Digital Files & Courses Catalog for Sale
  const [purchasedFiles, setPurchasedFiles] = useState<string[]>([]);
  const digitalFilesStore = [
    {
      id: 'EDU-01',
      title: 'Masterclass Déblocage GSM, FRP & Flashing 2026',
      type: 'course_video',
      category: 'GSM & Firmware',
      description: '14 heures de vidéos HD pas-à-pas : contournement Knox, autorisations EDL Xiaomi, flash USB-over-IP et déblocage officiel iPhone GSX.',
      format: 'Vidéo HD + Guides PDF + Outils',
      size: '4.8 Go',
      price: 39,
      downloads: 412,
      badge: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EDU-02',
      title: 'Pack Schémas Cartes Mères iPhone (11 Pro à 15 Pro Max)',
      type: 'file_pdf',
      category: 'Schémas & Hardware',
      description: 'Schémas électroniques vectoriels haute définition, diagrammes de pistes (boardviews) et points de test pour techniciens micro-soudure.',
      format: 'PDF Vectoriel + Boardviews',
      size: '850 Mo',
      price: 19,
      downloads: 280,
      badge: 'Technicien Pro',
      image: 'https://images.unsplash.com/photo-1597733336794-12d05021d510?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EDU-03',
      title: 'Guide d\'Importation Cargo & Dédouanement Haïti-USA',
      type: 'file_pdf',
      category: 'Commerce & Logistique',
      description: 'Comment acheter sur Shein, Amazon, Alibaba et acheminer en Haïti en toute sécurité avec optimisation fiscale et suivi de tracking.',
      format: 'E-Book PDF 85 pages',
      size: '24 Mo',
      price: 12,
      downloads: 640,
      badge: 'Indispensable',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EDU-04',
      title: 'Pack 500+ Templates Canva & Photoshop E-Commerce',
      type: 'file_zip',
      category: 'Graphisme & Design',
      description: 'Templates prêts à publier pour bannières Facebook, Instagram, flyers de livraison et visuels produits adaptés au marché haïtien.',
      format: 'Fichiers PSD + Liens Canva Pro',
      size: '1.2 Go',
      price: 15,
      downloads: 510,
      badge: 'Marketing',
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EDU-05',
      title: 'Formation Création Site Web WordPress + Passerelle MonCash',
      type: 'course_video',
      category: 'Développement Web',
      description: 'Apprenez à monter une boutique WooCommerce professionnelle avec hébergement sécurisé et intégration de paiement MonCash/Natcash.',
      format: '9 Heures de Vidéos + Code Source',
      size: '3.1 Go',
      price: 45,
      downloads: 195,
      badge: 'Tech & Dev',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'EDU-06',
      title: 'Pack Firmwares Certifiés Samsung & Xiaomi Sans Risque de Brick',
      type: 'file_zip',
      category: 'GSM & Firmware',
      description: 'Collection testée des ROMs officielles, modems multi-CSC et patchs NVRAM pour la remise à zéro rapide des smartphones.',
      format: 'Archives TAR/ZIP vérifiées',
      size: '12 Go',
      price: 25,
      downloads: 330,
      badge: 'Firmware Lab',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    },
  ];

  const handleBuyWithWallet = (fileItem: any) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    const currentWallet = db.getWallet(currentUser.id);
    if (currentWallet.balance < fileItem.price) {
      alert(`Solde insuffisant ($${currentWallet.balance.toFixed(2)} USD). Veuillez recharger votre portefeuille dans votre espace client.`);
      onNavigate('/dashboard');
      return;
    }

    // Process purchase
    db.executeTransaction({
      fromUserId: currentUser.id,
      toUserId: 'XGROUP_ACADEMY',
      amount: fileItem.price,
      module: 'education',
      description: `Achat Fichier/Cours : ${fileItem.title}`,
    });

    setPurchasedFiles((prev) => [...prev, fileItem.id]);
    alert(`Paiement de $${fileItem.price} USD confirmé ! Le lien de téléchargement immédiat est débloqué.`);
  };

  const handleAddToCartFile = (fileItem: any) => {
    if (onAddToCart) {
      onAddToCart({
        id: `file-${fileItem.id}`,
        title: fileItem.title,
        type: 'digital',
        price: fileItem.price,
        category: 'digital',
        description: fileItem.description,
        images: [fileItem.image],
        createdBy: 'XGROUP_ACADEMY',
        sellerName: 'X GROUP Academy',
        visibleToRoles: ['client', 'staff', 'admin'],
        status: 'active',
        stock: 999,
        rating: 5.0,
      });
      alert(`"${fileItem.title}" ajouté à votre panier !`);
    } else {
      onNavigate('/cart');
    }
  };

  const activeLesson = selectedCourse.lessons[activeLessonIndex] || selectedCourse.lessons[0];
  const courseQuizzes = selectedCourse.quizzes || (selectedCourse as any).quiz || [];

  const handleSelectCourse = (c: Course) => {
    setSelectedCourse(c);
    setActiveLessonIndex(0);
    setActiveTab('syllabus');
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
    setGeneratedCertificate(null);
  };

  const handleAnswerSelect = (qIdx: number, optId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optId }));
  };

  const handleEvaluateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    if (courseQuizzes.length === 0) return;

    let correctCount = 0;
    courseQuizzes.forEach((q: any, idx: number) => {
      const selected = quizAnswers[idx];
      const correct = q.correctAnswerId || q.correctIndex;
      if (selected === correct || selected === String(correct)) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / courseQuizzes.length) * 100);
    setQuizScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= 70) {
      const cert = db.issueCertificate({
        userId: currentUser.id,
        userName: currentUser.name,
        courseId: selectedCourse.courseId || selectedCourse.id || 'course-01',
        courseTitle: selectedCourse.title,
        grade: percentage,
        issuedAt: new Date().toISOString(),
      });
      setGeneratedCertificate(cert);
      setActiveTab('certificate');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-neutral-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>X GROUP Academy & Centre de Ressources Téléchargeables</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Éducation, <span className="text-amber-400">Cours & Fichiers Numériques</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Formations certifiantes, schémas de réparation, guides d'importation et packs de templates professionnels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && wallet && (
            <div className="bg-neutral-900 border border-neutral-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span className="text-neutral-400">Solde :</span>
              <span className="text-white font-mono font-bold">${wallet.balance.toFixed(2)}</span>
            </div>
          )}
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-500 text-amber-400 text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Autre cours ou fichier ? Dites-le nous !</span>
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 p-1.5 bg-neutral-900 border border-neutral-800 rounded-2xl">
        <button
          onClick={() => setActiveMainTab('store')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeMainTab === 'store'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Boutique de Cours & Fichiers ({digitalFilesStore.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('curriculum')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeMainTab === 'curriculum'
              ? 'bg-amber-500 text-black shadow-md'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Formations Interactives & Certificats Vérifiés</span>
        </button>
      </div>

      {/* TAB 1: BOUTIQUE DE COURS & FICHIERS */}
      {activeMainTab === 'store' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {digitalFilesStore.map((item) => {
              const isPurchased = purchasedFiles.includes(item.id);
              const priceGds = Math.round(item.price * 132);

              return (
                <div
                  key={item.id}
                  className="bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/70 text-amber-400 backdrop-blur-sm border border-amber-500/30">
                          {item.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-neutral-300 backdrop-blur-sm">
                          {item.size}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h3 className="text-base font-bold text-white leading-snug">{item.title}</h3>
                      <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>

                      <div className="bg-neutral-950 p-2.5 rounded-xl border border-neutral-850 text-[11px] text-neutral-400 flex items-center justify-between">
                        <span>Format : <strong className="text-white">{item.format}</strong></span>
                        <span className="text-emerald-400 font-bold">{item.downloads} téléchargements</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 space-y-3">
                    <div className="flex items-baseline justify-between border-t border-neutral-850 pt-3">
                      <div>
                        <span className="text-xl font-mono font-black text-amber-400">${item.price}.00 USD</span>
                        <span className="text-[10px] text-neutral-500 block font-mono">~{priceGds.toLocaleString()} HTG</span>
                      </div>
                    </div>

                    {isPurchased ? (
                      <button
                        onClick={() => alert(`Téléchargement de "${item.title}" lancé ! (Fichier sécurisé X GROUP).`)}
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Download className="w-4 h-4" />
                        <span>Télécharger Immédiatement ({item.size})</span>
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleBuyWithWallet(item)}
                          className="py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                        >
                          <Wallet className="w-3.5 h-3.5" />
                          <span>Payer Wallet</span>
                        </button>

                        <button
                          onClick={() => handleAddToCartFile(item)}
                          className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Au Panier</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: INTERACTIVE CURRICULUM & CERTIFICATES */}
      {activeMainTab === 'curriculum' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {courses.map((c) => {
              const currentId = selectedCourse.courseId || selectedCourse.id;
              const targetId = c.courseId || c.id;
              const isSelected = currentId === targetId;

              return (
                <button
                  key={targetId}
                  onClick={() => handleSelectCourse(c)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-amber-600/20 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
                      {c.duration}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-2 leading-snug">{c.title}</h3>
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{c.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                    <span>{c.lessons.length} Modules</span>
                    <span className="text-amber-400 font-semibold">{c.instructor}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-3">Plan de la Formation</h3>
              <div className="space-y-2">
                {selectedCourse.lessons.map((lesson, idx) => (
                  <button
                    key={lesson.id || idx}
                    onClick={() => {
                      setActiveLessonIndex(idx);
                      setActiveTab('syllabus');
                    }}
                    className={`w-full p-3 rounded-xl text-left text-xs font-semibold cursor-pointer transition-all flex items-center justify-between ${
                      activeLessonIndex === idx && activeTab === 'syllabus'
                        ? 'bg-amber-500 text-black font-bold'
                        : 'bg-neutral-950/70 border border-neutral-850 text-neutral-300 hover:text-white'
                    }`}
                  >
                    <span>{idx + 1}. {lesson.title}</span>
                    <span className="text-[10px] opacity-70">{lesson.duration}</span>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-800 space-y-2">
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    activeTab === 'quiz'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Passer le Test de Certification</span>
                </button>

                {generatedCertificate && (
                  <button
                    onClick={() => setActiveTab('certificate')}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Voir mon Certificat</span>
                  </button>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              {activeTab === 'syllabus' && (
                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Module {activeLessonIndex + 1}
                    </span>
                    <h2 className="text-2xl font-black text-white mt-1">{activeLesson.title}</h2>
                    <span className="text-xs text-neutral-400">Durée estimée : {activeLesson.duration}</span>
                  </div>

                  <div className="p-6 bg-neutral-950 border border-neutral-850 rounded-2xl text-xs sm:text-sm text-neutral-300 leading-relaxed space-y-4">
                    <p>{activeLesson.content}</p>
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && (
                <form onSubmit={handleEvaluateQuiz} className="space-y-6">
                  <div className="border-b border-neutral-800 pb-4">
                    <h2 className="text-xl font-bold text-white">Examen de Certification : {selectedCourse.title}</h2>
                    <p className="text-xs text-neutral-400 mt-1">Obtenez au moins 70% pour débloquer votre diplôme officiel.</p>
                  </div>

                  <div className="space-y-6">
                    {courseQuizzes.map((q: any, qIdx: number) => (
                      <div key={q.id || qIdx} className="bg-neutral-950 p-4 rounded-2xl border border-neutral-850 space-y-3">
                        <span className="text-xs font-bold text-white block">Question {qIdx + 1} : {q.question}</span>
                        <div className="space-y-1.5">
                          {q.options.map((opt: any) => {
                            const optId = typeof opt === 'string' ? opt : opt.id;
                            const optText = typeof opt === 'string' ? opt : opt.text;
                            return (
                              <label
                                key={optId}
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                                  quizAnswers[qIdx] === optId
                                    ? 'bg-amber-500/10 border-amber-500 text-white font-bold'
                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={`quiz-q-${qIdx}`}
                                  checked={quizAnswers[qIdx] === optId}
                                  onChange={() => handleAnswerSelect(qIdx, optId)}
                                  className="accent-amber-400"
                                />
                                <span>{optText}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-neutral-800">
                    {quizScore !== null && (
                      <div className={`text-sm font-bold ${quizScore >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        Résultat : {quizScore}% {quizScore >= 70 ? '(Diplôme Validé !)' : '(Échec, réessayez)'}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs cursor-pointer shadow-md ml-auto"
                    >
                      Soumettre et Valider le Diplôme
                    </button>
                  </div>
                </form>
              )}

              {activeTab === 'certificate' && generatedCertificate && (
                <div className="space-y-6">
                  <CertificateGenerator certificate={generatedCertificate} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Universal Request Modal */}
      <CustomServiceRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        defaultCategory="education"
      />
    </div>
  );
};

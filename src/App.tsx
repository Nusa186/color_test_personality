import { useState, useEffect } from 'react';
import { Pickaxe, Gem } from 'lucide-react';
import { supabase } from './lib/supabase';
import clsx from 'clsx';
import type { 
  PertanyaanPersonality, 
  PilihanPersonality, 
  WarnaPersonality,
  KeunggulanPersonality,
  KelemahanPersonality
} from './types';

function App() {
  const [questions, setQuestions] = useState<PertanyaanPersonality[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [allChoices, setAllChoices] = useState<PilihanPersonality[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [testCompleted, setTestCompleted] = useState(false);
  const [personality, setPersonality] = useState<WarnaPersonality | null>(null);
  const [kelebihan, setKelebihan] = useState<KeunggulanPersonality[]>([]);
  const [kelemahan, setKelemahan] = useState<KelemahanPersonality[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      // Mengambil semua pertanyaan
      const { data: questionsData, error: questionsError } = await supabase
        .from('pertanyaan_personality')
        .select('id, pertanyaan')
        .order('id');
      
      // Mengambil semua pilihan jawaban
      const { data: choicesData, error: choicesError } = await supabase
        .from('pilihan_personality')
        .select('id_pertanyaan, id_pilihan, teks_pilihan, nilai_pilihan');

      if (questionsError) throw questionsError;
      if (choicesError) throw choicesError;

      setQuestions(questionsData || []);
      setAllChoices(choicesData || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }

  // Mendapatkan pilihan jawaban untuk pertanyaan saat ini
  const getCurrentChoices = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return [];
    
    return allChoices.filter(choice => choice.id_pertanyaan === currentQuestion.id);
  };

  // Menentukan personality berdasarkan jawaban terbanyak
  const determinePersonality = () => {
    // Menghitung frekuensi jawaban
    const answerCounts: Record<string, number> = {};
    Object.values(userAnswers).forEach(answer => {
      answerCounts[answer] = (answerCounts[answer] || 0) + 1;
    });
    
    // Mencari jawaban dengan frekuensi tertinggi
    let maxCount = 0;
    let dominantAnswer = '';
    
    Object.entries(answerCounts).forEach(([answer, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantAnswer = answer;
      }
    });
    
    fetchPersonality(dominantAnswer);
  };

  async function fetchPersonality(nilai: string) {
    try {
      // Menentukan warna berdasarkan jawaban
      let warna = '';
      switch(nilai) {
        case 'A':
          warna = 'Merah';
          break;
        case 'B':
          warna = 'Kuning';
          break;
        case 'C':
          warna = 'Hijau';
          break;
        case 'D':
          warna = 'Biru';
          break;
        default:
          warna = 'Biru'; // Default warna
      }

      // Mengambil data personality berdasarkan warna
      const { data, error } = await supabase
        .from('warna_personality')
        .select('*')
        .eq('warna', warna)
        .maybeSingle();

      if (error) throw error;
      setPersonality(data);

      // Jika data personality ditemukan, ambil data kelebihan dan kelemahan
      if (data) {
        await fetchKelebihanKelemahan(data.id_personality);
      }
    } catch (error) {
      console.error('Error fetching personality:', error);
    }
  }

  async function fetchKelebihanKelemahan(idPersonality: string) {
    try {
      // Mengambil data kelebihan
      const { data: kelebihanData, error: kelebihanError } = await supabase
        .from('keunggulan_personality')
        .select('*')
        .eq('id_personality', idPersonality);

      // Mengambil data kelemahan
      const { data: kelemahanData, error: kelemahanError } = await supabase
        .from('kelemahan_personality')
        .select('*')
        .eq('id_personality', idPersonality);

      if (kelebihanError) throw kelebihanError;
      if (kelemahanError) throw kelemahanError;

      setKelebihan(kelebihanData || []);
      setKelemahan(kelemahanData || []);
    } catch (error) {
      console.error('Error fetching kelebihan and kelemahan:', error);
    }
  }

  const handleAnswer = (nilai: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    // Menyimpan jawaban user
    const newAnswers = { ...userAnswers, [currentQuestion.id]: nilai };
    setUserAnswers(newAnswers);
    
    // Jika masih ada pertanyaan berikutnya
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      // Update progress
      setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
    } else {
      // Jika semua pertanyaan telah dijawab
      setTestCompleted(true);
      setProgress(100);
      determinePersonality();
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
      // Update progress
      setProgress(((currentQuestionIndex - 1) / questions.length) * 100);
    }
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setCurrentQuestionIndex(0);
    setTestCompleted(false);
    setPersonality(null);
    setKelebihan([]);
    setKelemahan([]);
    setProgress(0);
  };

  // Fungsi untuk mendapatkan kelas warna berdasarkan warna personality
  const getColorClass = (warna: string | undefined) => {
    switch(warna) {
      case 'Merah': return 'text-red-600';
      case 'Kuning': return 'text-yellow-600';
      case 'Hijau': return 'text-green-600';
      case 'Biru': return 'text-blue-600';
      default: return 'text-blue-600';
    }
  };

  // Fungsi untuk mendapatkan kelas latar belakang berdasarkan warna personality
  const getBgColorClass = (warna: string | undefined) => {
    switch(warna) {
      case 'Merah': return 'bg-red-50';
      case 'Kuning': return 'bg-yellow-50';
      case 'Hijau': return 'bg-green-50';
      case 'Biru': return 'bg-blue-50';
      default: return 'bg-blue-50';
    }
  };

  // Fungsi untuk mendapatkan kelas warna header berdasarkan warna personality
  const getHeaderBgClass = (warna: string | undefined) => {
    switch(warna) {
      case 'Merah': return 'bg-red-600';
      case 'Kuning': return 'bg-yellow-600';
      case 'Hijau': return 'bg-green-600';
      case 'Biru': return 'bg-blue-600';
      default: return 'bg-blue-600';
    }
  };

  // Menghitung statistik jawaban
  const calculateAnswerStats = () => {
    if (!userAnswers || Object.keys(userAnswers).length === 0) return null;
    
    const counts: Record<string, number> = {};
    Object.values(userAnswers).forEach(answer => {
      counts[answer] = (counts[answer] || 0) + 1;
    });
    
    return {
      A: counts['A'] || 0,
      B: counts['B'] || 0,
      C: counts['C'] || 0,
      D: counts['D'] || 0
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Pickaxe className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentChoices = getCurrentChoices();
  const stats = calculateAnswerStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <Gem className="w-12 h-12 text-blue-600 mx-auto" />
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Color Personality Test
          </h1>
        </header>

        {!testCompleted ? (
          <>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
              <div 
                className="h-full bg-blue-600 rounded-full" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {currentQuestion && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                  <h2 className="text-xl text-white font-medium">
                    Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-xl text-gray-800 mb-6">{currentQuestion.pertanyaan}</p>
                  <div className="space-y-4">
                    {currentChoices.map((choice) => (
                      <label
                        key={choice.id_pilihan}
                        className={clsx(
                          "block rounded-xl cursor-pointer transition-all duration-200",
                          "border-2",
                          userAnswers[currentQuestion.id] === choice.nilai_pilihan
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                        )}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-current shrink-0">
                              {choice.nilai_pilihan}
                            </div>
                            <div>
                              <div className="text-gray-600">{choice.teks_pilihan}</div>
                            </div>
                            <input
                              type="radio"
                              name="question"
                              value={choice.nilai_pilihan}
                              checked={userAnswers[currentQuestion.id] === choice.nilai_pilihan}
                              onChange={() => handleAnswer(choice.nilai_pilihan)}
                              className="sr-only"
                            />
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <button 
                      onClick={handlePrevQuestion}
                      disabled={currentQuestionIndex === 0}
                      className={`px-6 py-2 rounded-md transition-colors ${
                        currentQuestionIndex === 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Kembali
                    </button>
                    
                    {userAnswers[currentQuestion.id] && currentQuestionIndex < questions.length - 1 && (
                      <button 
                        onClick={() => handleAnswer(userAnswers[currentQuestion.id])}
                        className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        Selanjutnya
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          personality ? (
            <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${getBgColorClass(personality.warna)}`}>
              <div className={`px-6 py-4 ${getHeaderBgClass(personality.warna)}`}>
                <h2 className="text-2xl font-bold text-white">
                  {personality.nama_personality}
                </h2>
              </div>
              
              <div className="p-6">
                {/* Statistik Jawaban */}
                {stats && (
                  <div className="mb-6">
                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div className="bg-red-100 p-3 rounded-lg text-center">
                        
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg text-center">
                        
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg text-center">
                        
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg text-center">
                        
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Warna */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${getColorClass(personality.warna)}`}>Warna</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${getHeaderBgClass(personality.warna)}`}></div>
                    <span className="text-gray-700 capitalize">{personality.warna}</span>
                  </div>
                </div>

                {/* Deskripsi */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${getColorClass(personality.warna)}`}>Deskripsi</h3>
                  <p className="text-gray-700">{personality.deskripsi}</p>
                </div>
                
                
                {/* Kelebihan */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${getColorClass(personality.warna)}`}>Kelebihan</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {kelebihan.length > 0 ? (
                      kelebihan.map((item, index) => (
                        <li key={`${item.id_personality}-${index}`}>{item.keunggulan}</li>
                      ))
                    ) : (
                      <li>Belum ada data kelebihan</li>
                    )}
                  </ul>
                </div>
                
                {/* Kelemahan */}
                <div className="mb-6">
                  <h3 className={`text-xl font-semibold mb-2 ${getColorClass(personality.warna)}`}>Kelemahan</h3>
                  <ul className="list-disc list-inside text-gray-700">
                    {kelemahan.length > 0 ? (
                      kelemahan.map((item, index) => (
                        <li key={`${item.id_personality}-${index}`}>{item.kelemahan}</li>
                      ))
                    ) : (
                      <li>Belum ada data kelemahan</li>
                    )}
                  </ul>
                </div>
                
                <div className="text-center">
                  <button onClick={resetQuiz} className={`px-6 py-2 rounded-md text-white transition-colors ${getHeaderBgClass(personality.warna)}`}>
                    Tes ulang
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-700 font-semibold">Memuat hasil...</div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
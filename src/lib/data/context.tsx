'use client';

import { useClasses } from '@/modules/classes/api';
import { Class } from '@/modules/classes/schema';
import { useResponsibles } from '@/modules/responsibles/api';
import { Responsible } from '@/modules/responsibles/schema';
import { useStudents } from '@/modules/students/api';
import { Student } from '@/modules/students/schema';
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';

interface DataContextProps {
  students: Student[];
  responsibles: Responsible[];
  classes: Class[];
  loading: boolean;
  loadStudents: () => void;
  loadResponsibles: () => void;
  loadClasses: () => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

interface DataProviderProps {
  children: ReactNode;
}

const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [responsibles, setResponsibles] = useState<Responsible[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { fetchStudents } = useStudents();
  const { fetchResponsibles } = useResponsibles();
  const { fetchClasses } = useClasses();

  const loadStudents = async () => {
    setLoading(true);
    try {
      const { data: studentsData } = await fetchStudents();

      setStudents(studentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadResponsibles = async () => {
    setLoading(true);
    try {
      const { data: responsiblesData } = await fetchResponsibles();

      setResponsibles(responsiblesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const loadClasses = async () => {
    setLoading(true);
    try {
      const { data: classesData } = await fetchClasses();

      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadStudents();
    loadResponsibles();
    loadClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider
      value={{
        students,
        responsibles,
        classes,
        loading,
        loadStudents,
        loadResponsibles,
        loadClasses,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

const useData = (): DataContextProps => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DataProvider, useData };

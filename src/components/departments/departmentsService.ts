import fs from 'fs';
import path from 'path';

// Caminho para o arquivo JSON
const filePath = path.resolve(__dirname, './departments.json');

// Função para garantir que o arquivo existe
const ensureFileExists = () => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([])); // Cria um arquivo vazio
  }
};

// Função para ler os dados do JSON
export const readDepartments = (): any[] => {
  ensureFileExists(); // Garante que o arquivo existe antes de ler
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Função para salvar os dados no JSON
export const saveDepartments = (departments: any[]): void => {
  ensureFileExists(); // Garante que o arquivo existe antes de salvar
  fs.writeFileSync(filePath, JSON.stringify(departments, null, 2));
};

// Função para obter todos os departamentos
export const getAllDepartments = (): any[] => {
  return readDepartments();
};

// Função para criar um novo departamento
export const createDepartment = (department: { name: string }) => {
  const departments = readDepartments();
  const newDepartment = {
    id: Date.now().toString(),
    ...department,
    active: true,
  };
  departments.push(newDepartment);
  saveDepartments(departments);
  return newDepartment;
};

// Função para atualizar um departamento
export const updateDepartment = (id: string, updates: Partial<{ name: string; active: boolean }>) => {
  const departments = readDepartments();
  const index = departments.findIndex((dep) => dep.id === id);
  if (index === -1) throw new Error('Departamento não encontrado');
  departments[index] = { ...departments[index], ...updates };
  saveDepartments(departments);
  return departments[index];
};

// Função para excluir um departamento
export const deleteDepartment = (id: string) => {
  const departments = readDepartments();
  const filteredDepartments = departments.filter((dep) => dep.id !== id);
  saveDepartments(filteredDepartments);
};

// Função para alternar o status (ativo/inativo) de um departamento
export const toggleDepartmentStatus = (id: string) => {
  const departments = readDepartments();
  const index = departments.findIndex((dep) => dep.id === id);
  if (index === -1) throw new Error('Departamento não encontrado');
  departments[index].active = !departments[index].active;
  saveDepartments(departments);
  return departments[index];
};

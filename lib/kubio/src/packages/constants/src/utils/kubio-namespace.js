const kubioNamespace = window?.kubioUtilsData?.kubioNamespacePrefix || '';

const getRootNamespace = () => {
	return kubioNamespace;
};

const rootNamespace = getRootNamespace();

export { rootNamespace };

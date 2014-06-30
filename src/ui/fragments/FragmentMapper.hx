package ui.fragments;

import sui.properties.ValueProperties;
import ui.fragments.FragmentProperties;
using thx.core.Iterators;

class FragmentMapper {
	public var fragments(default, null) : FragmentProperties;
	public var values(default, null) : ValueProperties;
	public function new(fragments : FragmentProperties, values : ValueProperties) {
		this.fragments = fragments;
		this.values = values;
	}

	public function getValuePropertyInfoForFragment(fragment : FragmentName)
		return fragments.getAssociations(fragment)
			.map(values.get);


	public function getAttachedPropertiesForFragment(fragment : Fragment)
		return fragments.getAssociations(fragment)
			.filter(function(name) return fragment.component.properties.exists(name))
			.map(values.get);

	public function getAttachablePropertiesForFragment(fragment : Fragment)
		return fragments.getAssociations(fragment)
			.filter(function(name) return !fragment.component.properties.exists(name))
			.map(values.get);
}